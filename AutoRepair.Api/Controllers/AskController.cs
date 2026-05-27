using AutoRepair.Api.Models;
using Azure.AI.OpenAI;
using Azure.Search.Documents;
using Azure.Search.Documents.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;

namespace AutoRepair.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AskController(
    AzureOpenAIClient openAiClient,
    SearchClient searchClient,
    IConfiguration config) : ControllerBase
{
    private const string EmbeddingModel = "text-embedding-3-small";

    [HttpPost]
    public async Task<IActionResult> AskAsync([FromBody] AskRequest req)
    {
        // Use model from request, fallback to gpt-4o
        var chatModel = config["AzureOpenAI:ChatDeployment"]; // req.Model ?? "gpt-4.1-mini"; // "gpt -4o";

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
            // NOTE: To enable semantic reranker (requires Basic SKU), uncomment:
            // QueryType = SearchQueryType.Semantic,
            // SemanticSearch = new SemanticSearchOptions {
            //     SemanticConfigurationName = "semantic-config"
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
            - Always identify which manual the answer comes from
              (Honda Odyssey 2005 or Acura TL 2003).
            - For diagnostic questions, provide numbered troubleshooting steps.
            - For specifications (torque, clearance, fluid capacity), quote
              the exact value from the manual.
            - For DTC codes, explain what the code means and the diagnostic steps.
            """;

        var userMessage = $"""
            Service manual excerpts:
            {context}

            Question: {req.Question}
            """;

        // 5. Call the selected model via Foundry Hub
        // var chatClient = openAiClient.GetChatClient(chatModel);
        var chatClient = openAiClient.GetChatClient(config["AzureOpenAI:ChatDeployment"]);
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
}
