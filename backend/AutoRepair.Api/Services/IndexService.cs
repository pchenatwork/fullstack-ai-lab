namespace AutoRepair.Api.Services;

using AutoRepair.Api.Models;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

public static class IndexService
{
    public static async Task EnsureIndexExistsAsync(SearchIndexClient client, string indexName)
    {
        // Explicitly define fields so names, vector dims and metadata are exact

        var fields = new FieldBuilder().Build(typeof(ServiceManualChunk));

        // Reuse the existing HNSW algorithm/profile names (do NOT change)
        var vectorSearch = new VectorSearch
        {
            Profiles = {
                new VectorSearchProfile("servicemanual-vector-profile", "servicemanual-hnsw")
            },
            Algorithms = {
                new HnswAlgorithmConfiguration("servicemanual-hnsw")
            }
        };

        // Add semantic ranker config (activates when QueryType = Semantic — Basic+ SKU)
        var semanticSearch = new SemanticSearch
        {
            Configurations = {
                new SemanticConfiguration(
                    "semantic-config",
                    new SemanticPrioritizedFields {
                        ContentFields = { new SemanticField("Text") }
                    })
            }
        };

        var index = new SearchIndex(indexName)
        {
            Fields = fields,
            VectorSearch = vectorSearch,
            SemanticSearch = semanticSearch   // Defined now, used optionally
        };

        await client.CreateOrUpdateIndexAsync(index);
    }
}
