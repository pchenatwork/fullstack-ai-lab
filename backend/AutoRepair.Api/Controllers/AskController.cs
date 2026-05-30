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
    private const string EmbeddingModel = "text-embedding-3-large"; // upgraded to large (3072 dims)

    [HttpPost]
    public async Task<IActionResult> AskAsync([FromBody] AskRequest req)
    {
        var chatModel = config["AzureOpenAI:ChatDeployment"];

        // 1. Embed the user's question
        var embedClient = openAiClient.GetEmbeddingClient(EmbeddingModel);
        var embedding = await embedClient.GenerateEmbeddingAsync(req.Question);

        // 2. Build semantic + vector search options
        var searchOptions = new SearchOptions
        {
            Size = 20,
            /*/
            QueryType = SearchQueryType.Semantic,
            SemanticSearchConfigurationName = "semantic-config",
            /*/
            QueryType = SearchQueryType.Semantic,
            SemanticSearch = new SemanticSearchOptions
            {
                SemanticConfigurationName = "semantic-config"
            },
            VectorSearch = new VectorSearchOptions
            {
                Queries = {
                    new VectorizedQuery(embedding.Value.ToFloats()) {
                        Fields = { "contentVector" },
                        KNearestNeighborsCount = 10
                    }
                }
            }
        };

        // Optional: scope to a single manual when the request specifies one
        if (!string.IsNullOrEmpty(req.Source))
        {
            searchOptions.Filter = $"source eq '{req.Source}'";
        }

        // 3. Execute hybrid search — pass question as keyword query + vector
        var results = await searchClient.SearchAsync<ServiceManualChunk>(
            req.Question,
            searchOptions);

        var docs = results.Value.GetResults()
            .Select(r => r.Document)
            .ToList();

        // Take top N content passages (already semantically ranked); choose top 8
        var context = string.Join("\n\n---\n\n",
            docs.Take(8).Select(d => d.Content));

        // 4. Build grounded prompt
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

        var chatClient = openAiClient.GetChatClient(config["AzureOpenAI:ChatDeployment"]);
        var response = await chatClient.CompleteChatAsync([
            new SystemChatMessage(systemPrompt),
            new UserChatMessage(userMessage)
        ]);

        return Ok(new
        {
            answer = response.Value.Content[0].Text,
            model = chatModel,
            chunksUsed = docs.Count
        });
    }
}
