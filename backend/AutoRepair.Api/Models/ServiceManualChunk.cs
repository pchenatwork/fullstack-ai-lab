using System.Text.Json.Serialization;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace AutoRepair.Api.Models;
public class ServiceManualChunk
{
    [SimpleField(IsKey = true, IsFilterable = true)]
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    // original filename for optional filtering
    [SimpleField(IsFilterable = true)]
    [JsonPropertyName("fileName")]
    public string FileName { get; set; } = string.Empty;

    // Primary text used for semantic ranking
    [SearchableField]
    [JsonPropertyName("content")]
    public string Content { get; set; } = string.Empty;

    // Vector field: dimensions updated to 3072 and profile name matches index profile
    [VectorSearchField(
        VectorSearchDimensions = 3072,
        VectorSearchProfileName = "servicemanual-vector-profile")]
    [JsonPropertyName("contentVector")]
    public float[] ContentVector { get; set; } = Array.Empty<float>();

    // Document isolation field (filterable + facetable)
    [SimpleField(IsFilterable = true, IsFacetable = true)]
    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    // Light metadata (filterable)
    [SimpleField(IsFilterable = true)]
    [JsonPropertyName("docType")]
    public string? DocType { get; set; }

    // Searchable section metadata (also filterable)
    [SearchableField(IsFilterable = true)]
    [JsonPropertyName("section")]
    public string? Section { get; set; }
}

public record IngestRequest(string FileName);
public record AskRequest(string Question, string? Model = "gpt-4.1-mini", string? Source = null);
