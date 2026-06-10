using AutoRepair.Api.Models;
using AutoRepair.Api.Services;
using Azure;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Models;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using UglyToad.PdfPig;

namespace AutoRepair.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class Ody06Controller(
    AzureOpenAIClient openAiClient,
    SearchClient searchClient,
    SearchIndexClient indexClient,
    IConfiguration config) : ControllerBase
{
    private const string EmbeddingModel = "text-embedding-3-large"; // upgraded to large (3072 dims)
    private const int ChunkWords = 600;
    private const int OverlapWords = 90;
    private const int EmbedBatchSize = 64;   // texts per embedding call (stay under TPM)
    private const int UploadBatchSize = 500;  // docs per AI Search upload call

    /// <summary>
    /// POST /api/ody06/ask — Query the service manual using RAG with hybrid search (BM25 + vector).
    /// </summary>
    [HttpPost("ask")]
    public async Task<IActionResult> AskAsync([FromBody] AskRequest req)
    {
        // Use configured model, fallback to gpt-4o
        var chatModel = config["AzureOpenAI:ChatDeployment"] ?? "gpt-4o";

        // 1. Embed the user's question
        var embedClient = openAiClient.GetEmbeddingClient(EmbeddingModel);
        var embedding = await embedClient.GenerateEmbeddingAsync(req.Question);

        // 2. Build hybrid search — BM25 keyword + KNN vector simultaneously
        // This ensures exact matches (part numbers, DTCs, fuse IDs) are never missed
        var searchOptions = new SearchOptions
        {
            Size = 5,
            VectorSearch = new VectorSearchOptions
            {
                Queries = {
                    new VectorizedQuery(embedding.Value.ToFloats()) {
                        Fields = { "TextVector" },
                        KNearestNeighborsCount = 5
                    }
                }
            }
            // NOTE: Semantic L2 reranker requires Basic SKU+ (Appendix D.6).
            // On Free tier leave commented; query still runs as BM25 + vector.
            // QueryType = SearchQueryType.Semantic,
            // SemanticSearch = new SemanticSearchOptions {
            //     SemanticConfigurationName = "semantic-config"  // note: not SemanticSearchConfigurationName
            // }
        };

        // 3. Execute hybrid search — pass question as keyword query + vector
        // Azure AI Search runs BM25 and KNN in parallel, merges via RRF
        var results = await searchClient.SearchAsync<ServiceManualChunk>(
            req.Question,   // BM25 keyword text
            searchOptions); // + vector query inside options

        var context = string.Join("\n\n---\n\n",
            results.Value.GetResults().Select(r => r.Document.Text));

        // 4. Build grounded prompt with structured diagnostic guidance
        var systemPrompt = """
            You are an automotive service manual assistant.
            Use ONLY the provided manual excerpts to answer the question.

            Rules:
            - If the answer is not in the excerpts, say so clearly — do not guess.
            - For diagnostic questions, provide numbered troubleshooting steps.
            - For specifications (torque, clearance, fluid capacity), quote the exact value from the manual.
            - For DTC codes, explain what the code means and the diagnostic steps.
            - Provide up to 3 page numbers that are relevant, ranking from high to low, you can say "Refer to page X, Y, Z" but do not fabricate page numbers.
            """;

        var userMessage = $"""
            Service manual excerpts:
            {context}

            Question: {req.Question}
            """;

        // 5. Call the selected model via Foundry Hub
        var chatClient = openAiClient.GetChatClient(chatModel);
        var response = await chatClient.CompleteChatAsync([
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userMessage)
        ]);

        return Ok(new
        {
            answer = response.Value.Content[0].Text,
            model = chatModel,
            chunksUsed = 5
        });
    }

    /// <summary>
    /// POST /api/ody06/ingest — Ingest a PDF from Blob Storage, chunk it, embed chunks, and upsert to AI Search.
    /// </summary>
    [HttpPost("ingest")]
    public async Task<IActionResult> IngestAsync([FromBody] IngestRequest req)
    {
        // 1. Ensure the index exists (idempotent). One config key is the
        // single source of truth for the index name — rename in one place.
        var indexName = config["AzureSearch:IndexName"]!;
        await IndexService.EnsureIndexExistsAsync(indexClient, indexName);

        // 2. Download PDF from Blob Storage
        var blobClient = new Azure.Storage.Blobs.BlobClient(
            config["BlobStorage:ConnectionString"], "repairmanuals", req.FileName);
        using var stream = await blobClient.OpenReadAsync();

        // 3. Extract text with PdfPig
        using var pdf = PdfDocument.Open(stream);
        var fullText = string.Join(" ",
            pdf.GetPages().Select(p => p.Text));

        // 4. Split into ~600-word chunks with ~90-word overlap (Appendix D.3)
        var words = fullText.Split(
            (char[]?)null, StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<(string text, int index)>();
        int step = ChunkWords - OverlapWords;   // 510
        for (int start = 0, i = 0; start < words.Length; start += step, i++)
        {
            var slice = words.Skip(start).Take(ChunkWords);
            chunks.Add((string.Join(" ", slice), i));
            if (start + ChunkWords >= words.Length) break;
        }

        // 5. Embed in batches, then upload in batches (Appendix D.9)
        var sourceTag = ToSourceTag(req.FileName);
        var embedClient = openAiClient.GetEmbeddingClient(EmbeddingModel);

        var uploadBatch = new List<ServiceManualChunk>(UploadBatchSize);

        // Process chunks in embedding-sized groups
        foreach (var group in chunks.Chunk(EmbedBatchSize))
        {
            // One embedding call for the whole group (array in, array out)
            var inputs = group.Select(c => c.text).ToList();
            var embeddings = await embedClient.GenerateEmbeddingsAsync(inputs);

            // Pair each embedding back with its chunk (order is preserved)
            for (int i = 0; i < group.Length; i++)
            {
                uploadBatch.Add(new ServiceManualChunk
                {
                    Id = $"{sourceTag}-{group[i].index}",
                    FileName = req.FileName,
                    Source = sourceTag,
                    DocType = "procedure",
                    Text = group[i].text,
                    TextVector = embeddings.Value[i].ToFloats().ToArray()
                });

                if (uploadBatch.Count >= UploadBatchSize)
                {
                    await UploadWithRetryAsync(searchClient, uploadBatch);
                    uploadBatch.Clear();
                }
            }
        }

        // Upload any remaining docs
        if (uploadBatch.Count > 0)
            await UploadWithRetryAsync(searchClient, uploadBatch);

        return Ok(new { chunksIngested = chunks.Count, fileName = req.FileName, source = sourceTag });
    }

    /// <summary>
    /// Convert a file name to a source tag (e.g., "odyssey-2005.pdf" → "odyssey_2005").
    /// </summary>
    private static string ToSourceTag(string fileName)
    {
        var name = Path.GetFileNameWithoutExtension(fileName).ToLowerInvariant();
        if (name.Contains("odyssey")) return "odyssey_2005";
        if (name.Contains("acura") || name.Contains("tl")) return "acura_tl_2003";
        return name.Replace('-', '_').Replace(' ', '_');
    }

    /// <summary>
    /// Exponential backoff on throttling (503 / 429). The SDK retries some
    /// transient faults itself; this guards the batch upload explicitly.
    /// </summary>
    private static async Task UploadWithRetryAsync(
        SearchClient client, IList<ServiceManualChunk> docs)
    {
        for (int attempt = 0; attempt < 5; attempt++)
        {
            try
            {
                await client.UploadDocumentsAsync(docs);
                return;
            }
            catch (RequestFailedException ex) when (ex.Status == 503 || ex.Status == 429)
            {
                // 1s, 2s, 4s, 8s, 16s
                await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, attempt)));
            }
        }
        throw new InvalidOperationException(
            "AI Search upload failed after retries (still throttled).");
    }
}
