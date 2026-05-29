using AutoRepair.Api.Models;
using AutoRepair.Api.Models.Common;
using AutoRepair.Api.Repositories;

namespace AutoRepair.Api.Services;

/// <summary>
/// Intentionally thin pass-through for now — there is no business rule for a vehicle
/// lookup yet. It exists to keep a uniform Controller -> Service -> Repository structure
/// so the seam for logic is already in place before a feature needs it.
/// </summary>
public class VehicleService : IVehicleService
{
    private readonly IVehicleRepository _repository;

    public VehicleService(IVehicleRepository repository)
        => _repository = repository;

    public PagedResult<VehicleGeneration> Search(PagedRequest request)
        => _repository.Query(request);
}
