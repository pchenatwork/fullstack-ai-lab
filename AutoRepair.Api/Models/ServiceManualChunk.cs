using Azure.Search.Documents.Indexes;
using Azure.Search.Documents.Indexes.Models;

namespace AutoRepair.Api.Models;
public class ServiceManualChunk
{
    [SimpleField(IsKey = true, IsFilterable = true)]
    public string Id { get; set; } = string.Empty;
    
    [SearchableField(IsFilterable = true)]
    // The name of the file from which this chunk was extracted. This allows us to filter search results by file name.
    // The IsFilterable = true on FileName lets you optionally filter queries to one manual at a time
    public string FileName { get; set; } = string.Empty;

    [SearchableField]
    public string Text { get; set; } = string.Empty;

    [VectorSearchField(
        VectorSearchDimensions = 1536,
        VectorSearchProfileName = "servicemanual-vector-profile")]
    public float[] TextVector { get; set; } = [];
}
public record IngestRequest(string FileName);
public record AskRequest(string Question, string? Model = "gpt-4.1-mini");
