import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { PagedRequest } from "@/types/api";
import { searchVehicles } from "./api";
import { useDebounce } from "./useDebounce";
import { columns } from "./columns";
import { Pager } from "./Pager";

const PAGE_SIZE = 20;

export function VehicleTable() {
  // Feature-local UI state (deliberately useState, not a global store).
  const [pageNumber, setPageNumber] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>("make");
  const [isDescending, setIsDescending] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 1000);

  // Assemble the request. Memoized so the query key is stable between renders.
  const request: PagedRequest = useMemo(
    () => ({
      pageNumber,
      pageSize: PAGE_SIZE,
      sortColumn,
      isDescending,
      filter: debouncedSearch.trim() || undefined,
    }),
    [pageNumber, sortColumn, isDescending, debouncedSearch]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicles", request],
    queryFn: () => searchVehicles(request),
    placeholderData: keepPreviousData, // no empty flash while paging
  });

  function handleSort(key: string | null) {
    if (!key) return;
    if (key === sortColumn) {
      setIsDescending((d) => !d);
    } else {
      setSortColumn(key);
      setIsDescending(false);
    }
    setPageNumber(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPageNumber(1); // any new filter resets to first page
  }

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalCount = data?.totalCount ?? 0;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
        Vehicle Generation Lookup
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 680, marginTop: 6 }}>
        Server-side paginated, sortable, and searchable. Search is debounced; sorting and
        paging re-query the API.
      </p>

      <input
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search make, model, generation, platform, class…"
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "16px 0",
          padding: "10px 12px",
          border: "1px solid var(--border)",
          borderRadius: 4,
          fontSize: 14,
          fontFamily: "var(--font)",
        }}
      />

      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-soft)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "var(--crumb-bg)" }}>
              {columns.map((col) => {
                const active = col.sortKey === sortColumn;
                return (
                  <th
                    key={col.header}
                    onClick={() => handleSort(col.sortKey)}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      color: "var(--accent-dark)",
                      fontWeight: 600,
                      cursor: col.sortKey ? "pointer" : "default",
                      whiteSpace: "nowrap",
                      userSelect: "none",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                      {col.header}
                      {active &&
                        (isDescending ? <ArrowDown size={13} /> : <ArrowUp size={13} />)}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columns.length} style={cellMsg}>
                  Loading…
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={columns.length} style={{ ...cellMsg, color: "#A32D2D" }}>
                  {(error as Error)?.message ?? "Failed to load vehicles."}
                </td>
              </tr>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={cellMsg}>
                  No vehicles match your search.
                </td>
              </tr>
            )}
            {!isError &&
              items.map((v) => (
                <tr key={v.id} style={{ borderTop: "1px solid var(--border-soft)" }}>
                  {columns.map((col) => (
                    <td key={col.header} style={{ padding: "9px 14px", color: "var(--text)" }}>
                      {col.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pager
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        onPrev={() => setPageNumber((p) => Math.max(1, p - 1))}
        onNext={() => setPageNumber((p) => (p < totalPages ? p + 1 : p))}
      />
    </div>
  );
}

const cellMsg: React.CSSProperties = {
  padding: "20px 14px",
  textAlign: "center",
  color: "var(--text-muted)",
};
