using System.Text.Json.Serialization;
using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace AutoRepair.Api.Models;
[Obsolete()]
public class ServiceManualChunk_Old
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

public class ServiceManualChunk
{
    [SimpleField(IsKey = true, IsFilterable = true)]
    public string Id { get; set; } = string.Empty;

    [SearchableField(IsFilterable = true)]
    public string FileName { get; set; } = string.Empty;

    // Document-isolation key — short tag like "odyssey_2005" (Appendix D.1)
    [SimpleField(IsFilterable = true, IsFacetable = true)]
    public string Source { get; set; } = string.Empty;

    // Light metadata: "procedure" | "dtc" | "table" | "wiring"
    [SimpleField(IsFilterable = true)]
    public string DocType { get; set; } = "procedure";

    [SearchableField]
    public string Text { get; set; } = string.Empty;

    // 3072 dims = text-embedding-3-large. MUST match the embedding model.
    [VectorSearchField(
        VectorSearchDimensions = 3072,
        VectorSearchProfileName = "servicemanual-vector-profile")]
    public float[] TextVector { get; set; } = [];
}

public record IngestRequest(string FileName);
public record AskRequest(string Question, string? Model = "gpt-4.1-mini", string? Source = null);
