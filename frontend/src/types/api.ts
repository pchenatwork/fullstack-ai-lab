// Generic, reusable pagination contracts. Mirror the C# Models/Common on the API side.
// Any paginated feature reuses these; feature-specific row types live in the feature.

export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
  sortColumn?: string;
  isDescending: boolean;
  filter?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
