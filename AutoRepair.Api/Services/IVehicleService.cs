using AutoRepair.Api.Models;
using AutoRepair.Api.Models.Common;

namespace AutoRepair.Api.Services;

/// <summary>
/// Business-logic seam for vehicle queries. Thin today (it delegates straight to the
/// repository), but it is the consistent home for logic that data-heavy features will
/// need — orchestration across repositories, entity-to-DTO mapping, caching, policy.
/// Keeping it here means adding that logic later never requires changing the controller.
/// </summary>
public interface IVehicleService
{
    PagedResult<VehicleGeneration> Search(PagedRequest request);
}
