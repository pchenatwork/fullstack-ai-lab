namespace AutoRepair.Api.Services;

using AutoRepair.Api.Models;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

public static class IndexService
{
    public static async Task EnsureIndexExistsAsync(SearchIndexClient client, string indexName)
    {
        // Explicitly define fields so names, vector dims and metadata are exact
        var fields = new List<SearchField>
        {
            new SimpleField("id", SearchFieldDataType.String) { IsKey = true },
            new SimpleField("fileName", SearchFieldDataType.String) { IsFilterable = true },
            new SearchableField("content"),
            new SearchField("contentVector", SearchFieldDataType.Collection(SearchFieldDataType.Single))
            {
                IsSearchable = true,
                VectorSearchDimensions = 3072, // text-embedding-3-large
                VectorSearchProfileName = "servicemanual-vector-profile" // preserve existing profile name
            },
            new SimpleField("source", SearchFieldDataType.String) { IsFilterable = true, IsFacetable = true },
            new SimpleField("docType", SearchFieldDataType.String) { IsFilterable = true },
            new SearchableField("section") { IsFilterable = true }
        };

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
                    new SemanticPrioritizedFields
                    {
                        ContentFields = { new SemanticField("content") }
                    })
            }
        };

        var index = new SearchIndex(indexName) 
        {
            Fields = fields,
            VectorSearch = vectorSearch,
            SemanticSearch = semanticSearch
        };

        await client.CreateOrUpdateIndexAsync(index);
    }
}
