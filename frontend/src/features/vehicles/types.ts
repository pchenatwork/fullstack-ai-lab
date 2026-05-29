// Feature-specific row type. The generic PagedRequest/PagedResult live in @/types/api.

export interface VehicleGeneration {
  id: number;
  make: string;
  model: string;
  generation: string;
  platformCode: string | null;
  yearFrom: number;
  yearTo: number | null; // null = present
  class: string;
}
