import type { PagedRequest, PagedResult } from "@/types/api";
import type { VehicleGeneration } from "./types";

const BASE = import.meta.env.VITE_API_BASE_URL;

// POST /api/vehicles/search — body is the PagedRequest, returns PagedResult<VehicleGeneration>.
// Same contract as the C# side; swapping the mock for the real endpoint needs no changes here.
export async function searchVehicles(
  req: PagedRequest
): Promise<PagedResult<VehicleGeneration>> {
  const res = await fetch(`${BASE}/api/vehicles/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    throw new Error(`Vehicle search failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
