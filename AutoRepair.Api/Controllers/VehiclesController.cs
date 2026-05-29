using AutoRepair.Api.Models;
using AutoRepair.Api.Models.Common;
using AutoRepair.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AutoRepair.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;

    public VehiclesController(IVehicleService vehicleService)
        => _vehicleService = vehicleService;

    /// <summary>
    /// POST api/vehicles/search
    /// Body: PagedRequest { pageNumber, pageSize, sortColumn, isDescending, filter }
    /// Returns a PagedResult&lt;VehicleGeneration&gt;.
    /// </summary>
    [HttpPost("search")]
    public ActionResult<PagedResult<VehicleGeneration>> Search([FromBody] PagedRequest request)
        => Ok(_vehicleService.Search(request));
}
