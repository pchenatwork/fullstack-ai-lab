import type { VehicleGeneration } from "./types";

// Column definitions for the table. `sortKey` is the value sent as PagedRequest.sortColumn;
// it must match a key the API allows (see the C# SortMap allowlist). A null sortKey means
// the column is display-only and not sortable.

export interface ColumnDef {
  header: string;
  sortKey: string | null;
  render: (v: VehicleGeneration) => string;
}

export const columns: ColumnDef[] = [
  { header: "Make", sortKey: "make", render: (v) => v.make },
  { header: "Model", sortKey: "model", render: (v) => v.model },
  { header: "Generation", sortKey: "generation", render: (v) => v.generation },
  {
    header: "Platform",
    sortKey: "platformCode",
    render: (v) => v.platformCode ?? "—",
  },
  {
    header: "Years",
    sortKey: "yearFrom",
    render: (v) => `${v.yearFrom}\u2013${v.yearTo ?? "present"}`,
  },
  { header: "Class", sortKey: "class", render: (v) => v.class },
];
