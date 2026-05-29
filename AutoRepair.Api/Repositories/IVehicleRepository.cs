using AutoRepair.Api.Models;
using AutoRepair.Api.Models.Common;

namespace AutoRepair.Api.Repositories;

/// <summary>
/// Data-access contract for vehicle generations. The implementation behind this
/// (embedded JSON today, EF/SQL or NoSQL later) is invisible to callers — swap the
/// registration in Program.cs and nothing upstream changes.
/// </summary>
public interface IVehicleRepository
{
    PagedResult<VehicleGeneration> Query(PagedRequest request);
}
