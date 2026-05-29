using System.Text.Json;
using AutoRepair.Api.Models;
using AutoRepair.Api.Models.Common;

namespace AutoRepair.Api.Repositories;

/// <summary>
/// Reads vehicles.json once at construction (registered as a singleton, so the file
/// is loaded a single time for the app's lifetime) and serves filter/sort/page queries
/// from the in-memory list. Suitable for static reference data; swap for an EF-backed
/// implementation when the data moves to a database.
/// </summary>
public class JsonFileVehicleRepository : IVehicleRepository
{
    private readonly List<VehicleGeneration> _all;

    // Allowlist of sortable columns. Input not in this map falls back to the default sort,
    // which keeps arbitrary/unknown sort columns from doing anything unexpected.
    private static readonly Dictionary<string, Func<VehicleGeneration, object?>> SortMap =
        new(StringComparer.OrdinalIgnoreCase)
        {
            ["make"]         = v => v.Make,
            ["model"]        = v => v.Model,
            ["generation"]   = v => v.Generation,
            ["platformCode"] = v => v.PlatformCode,
            ["yearFrom"]     = v => v.YearFrom,
            // Null YearTo (a current generation) sorts as the current year, so "present"
            // is treated as the most recent rather than the smallest value.
            ["yearTo"]       = v => v.YearTo ?? DateTime.UtcNow.Year,
            ["class"]        = v => v.Class,
        };

    public JsonFileVehicleRepository(IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "Data", "vehicles.json");
        using var stream = File.OpenRead(path);
        _all = JsonSerializer.Deserialize<List<VehicleGeneration>>(stream,
                   new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
               ?? [];
    }

    public PagedResult<VehicleGeneration> Query(PagedRequest request)
    {
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var pageNumber = Math.Max(request.PageNumber, 1);

        IEnumerable<VehicleGeneration> query = _all;

        // --- Filter: free-text across the useful columns ---
        if (!string.IsNullOrWhiteSpace(request.Filter))
        {
            var f = request.Filter.Trim();
            query = query.Where(v =>
                v.Make.Contains(f, StringComparison.OrdinalIgnoreCase) ||
                v.Model.Contains(f, StringComparison.OrdinalIgnoreCase) ||
                v.Generation.Contains(f, StringComparison.OrdinalIgnoreCase) ||
                v.Class.Contains(f, StringComparison.OrdinalIgnoreCase) ||
                (v.PlatformCode ?? "").Contains(f, StringComparison.OrdinalIgnoreCase));
        }

        // --- Sort: allowlisted column, else a stable default ---
        if (request.SortColumn is not null && SortMap.TryGetValue(request.SortColumn, out var keySelector))
        {
            query = request.IsDescending
                ? query.OrderByDescending(keySelector)
                : query.OrderBy(keySelector);
        }
        else
        {
            query = query.OrderBy(v => v.Make).ThenBy(v => v.Model).ThenBy(v => v.YearFrom);
        }

        var total = query.Count();

        var items = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PagedResult<VehicleGeneration>
        {
            Items = items,
            TotalCount = total,
            PageNumber = pageNumber,
            PageSize = pageSize
        };
    }
}
