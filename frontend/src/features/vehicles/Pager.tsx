import { ChevronLeft, ChevronRight } from "lucide-react";

interface PagerProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
}

const btn = (disabled: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "6px 12px",
  borderRadius: 3,
  fontSize: 13,
  fontWeight: 600,
  border: "1px solid var(--border)",
  background: disabled ? "#EDEFF2" : "#fff",
  color: disabled ? "#9AA0A6" : "var(--accent)",
  cursor: disabled ? "not-allowed" : "pointer",
});

export function Pager({ pageNumber, totalPages, totalCount, onPrev, onNext }: PagerProps) {
  const onFirst = pageNumber <= 1;
  const onLast = pageNumber >= totalPages || totalPages === 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 14,
        fontSize: 13,
        color: "var(--text-muted)",
      }}
    >
      <span>{totalCount.toLocaleString()} results</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={btn(onFirst)} disabled={onFirst} onClick={onPrev}>
          <ChevronLeft size={14} /> Prev
        </button>
        <span>
          Page {totalPages === 0 ? 0 : pageNumber} of {totalPages}
        </span>
        <button style={btn(onLast)} disabled={onLast} onClick={onNext}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
