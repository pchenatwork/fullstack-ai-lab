using AutoRepair.Api.Models;
using AutoRepair.Api.Services;
using Azure;
using Azure.AI.OpenAI;
using Azure.Search.Documents;          // SearchClient, SearchDocument, SearchOptions
using Azure.Search.Documents.Indexes;  // SearchIndexClient
using Azure.Search.Documents.Indexes.Models; // SearchIndex, SearchField, SemanticConfiguration, etc.
using Azure.Search.Documents.Models;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using UglyToad.PdfPig;


namespace AutoRepair.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IngestController(
    AzureOpenAIClient openAiClient,
    SearchIndexClient indexClient,
    IConfiguration config) : ControllerBase
{
    private const int ChunkWords = 600;
    private const int OverlapWords = 90;
    private const string EmbeddingModel = "text-embedding-3-large"; // upgraded to large (3072 dims)

    [HttpPost]
    public async Task<IActionResult> IngestAsync([FromBody] IngestRequest req)
    {
        var indexName = config["AzureSearch:IndexName"]!;
        // 1. Ensure the index exists (idempotent)
        await IndexService.EnsureIndexExistsAsync(indexClient, indexName);

        // 2. Download PDF from Blob Storage
        var blobClient = new BlobClient(
            config["BlobStorage:ConnectionString"], "repairmanuals", req.FileName);
        using var stream = await blobClient.OpenReadAsync();

        // 3. Extract text with PdfPig
        using var pdf = PdfDocument.Open(stream);

        var sb = new System.Text.StringBuilder();
        var pageCount = pdf.NumberOfPages;
        int i = 0;
        foreach (var page in pdf.GetPages())
        {
            sb.Append(page.Text);
            sb.Append(' ');
            i++;
            if (i % 100 == 0)
                Debug.WriteLine($"  Extracted {i}/{pageCount} pages... currrent page content {page.Text}");
        }
        var fullText = sb.ToString();

        // 4. Split into ~600-word chunks with ~90-word overlap
        var rawChunks = ChunkText(fullText, ChunkWords, OverlapWords);

        // 5. Embed each chunk and upsert into AI Search
        var embedClient = openAiClient.GetEmbeddingClient(EmbeddingModel);
        var searchClient = new SearchClient(
            new Uri(config["AzureSearch:Endpoint"]!),
            "ody06-servicemanuals-index",
            new AzureKeyCredential(config["AzureSearch:ApiKey"]!));

        var sourceTag = ToSourceTag(req.FileName);
        var safeFileName = System.Text.RegularExpressions.Regex.Replace(req.FileName, @"[^a-zA-Z0-9_\-=]", "_");

        int chunkIndex = 0;
        foreach (var chunkText in rawChunks)
        {
            var embedding = await embedClient.GenerateEmbeddingAsync(chunkText);
            var floats = embedding.Value.ToFloats().ToArray();

            //var doc = new Azure.Search.Documents.SearchDocument
            var doc = new SearchDocument
            {
                ["id"] = $"{sourceTag}-{chunkIndex}",
                ["fileName"] = safeFileName,
                ["content"] = chunkText,
                ["contentVector"] = floats,
                ["source"] = sourceTag,
                ["docType"] = "procedure",
                ["section"] = null
            };

            await searchClient.UploadDocumentsAsync(new[] { doc });
            chunkIndex++;
        }

        return Ok(new { chunksIngested = rawChunks.Count, fileName = req.FileName });
    }

    private static List<string> ChunkText(string text, int chunkWords = 600, int overlapWords = 90)
    {
        var words = text.Split(new[] { ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();
        int step = Math.Max(1, chunkWords - overlapWords);

        for (int start = 0; start < words.Length; start += step)
        {
            var slice = words.Skip(start).Take(chunkWords);
            chunks.Add(string.Join(" ", slice));
            if (start + chunkWords >= words.Length) break;
        }
        return chunks;
    }

    private static string ToSourceTag(string fileName)
    {
        var name = Path.GetFileNameWithoutExtension(fileName).ToLowerInvariant();
        if (name.Contains("odyssey")) return "odyssey_2005";
        if (name.Contains("acura") || name.Contains("tl")) return "acura_tl_2003";
        return name.Replace('-', '_').Replace(' ', '_');
    }
}