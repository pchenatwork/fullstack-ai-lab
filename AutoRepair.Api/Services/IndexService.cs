namespace AutoRepair.Api.Services;

using AutoRepair.Api.Models;

// The semantic configuration is defined here but only activates at query time when you set QueryType = Semantic (requires Basic SKU or higher).

using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;
public static class IndexService
{
    public static async Task EnsureIndexExistsAsync(SearchIndexClient client)
    {
        var fields = new FieldBuilder().Build(typeof(ServiceManualChunk));

        // HNSW vector algorithm for approximate nearest-neighbour search
        var vectorSearch = new VectorSearch
        {
            Profiles = {
                new VectorSearchProfile("servicemanual-vector-profile", "servicemanual-hnsw")
            },
            Algorithms = {
                new HnswAlgorithmConfiguration("servicemanual-hnsw")
            }
        };

        // Semantic config — activates when QueryType = Semantic (Basic SKU+)
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

        var index = new SearchIndex("servicemanuals-index")
        {
            Fields = fields,
            VectorSearch = vectorSearch,
            SemanticSearch = semanticSearch   // Defined now, used optionally
        };

        await client.CreateOrUpdateIndexAsync(index);
    }

}
