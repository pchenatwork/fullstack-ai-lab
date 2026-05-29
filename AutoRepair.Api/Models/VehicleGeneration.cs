namespace AutoRepair.Api.Models;

/// <summary>
/// One generation of a vehicle model sold in North America, with its production
/// year span. One record == one generation (e.g. the Accord appears once per generation).
/// </summary>
public class VehicleGeneration
{
    public int Id { get; set; }
    public string Make { get; set; } = "";
    public string Model { get; set; } = "";
    public string Generation { get; set; } = "";
    public string? PlatformCode { get; set; }
    public int YearFrom { get; set; }

    /// <summary>End model year of this generation. Null means the generation is current ("present").</summary>
    public int? YearTo { get; set; }

    public string Class { get; set; } = "";
}
