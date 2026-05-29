namespace AutoRepair.Api.Models.Common;

public class PagedRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortColumn { get; set; }
    public bool IsDescending { get; set; }
    public string? Filter { get; set; }
}
