import { useEffect, useRef, useState } from "react";
import { Send, Info, Trash2 } from "lucide-react";
import { useQaStore } from "./store";
import { useAskManual } from "./useAskManual";
import { QaTurn } from "./QaTurn";

export function ManualAssistant() {
  const entries = useQaStore((s) => s.entries);
  const clear = useQaStore((s) => s.clear);
  const { ask, isPending } = useAskManual();

  const [question, setQuestion] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest entry whenever the log changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  function submit() {
    if (!question.trim() || isPending) return;
    ask(question);
    setQuestion("");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
            Service Manual RAG Q&amp;A
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 680, marginTop: 6 }}>
            Ask a question about the Honda Odyssey or Acura TL service manual.
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={clear}
            title="Clear session log"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#fff",
              border: "1px solid var(--border)",
              color: "var(--accent)",
              borderRadius: 3,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Trash2 size={14} /> Clear
          </button>
        )}
      </div>

      {/* Transcript */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-soft)",
          borderRadius: 4,
          padding: 16,
          marginTop: 16,
          minHeight: 240,
          maxHeight: 460,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {entries.length === 0 ? (
          <div style={{ color: "var(--text-muted)", fontSize: 13.5, margin: "auto" }}>
            Ask a question to get started.
          </div>
        ) : (
          entries.map((e) => <QaTurn key={e.id} entry={e} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ask another question…"
          style={{
            flex: 1,
            padding: "10px 12px",
            border: "1px solid var(--border)",
            borderRadius: 4,
            fontSize: 14,
            fontFamily: "var(--font)",
          }}
        />
        <button
          onClick={submit}
          disabled={isPending || !question.trim()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: isPending || !question.trim() ? "#EDEFF2" : "var(--accent)",
            color: isPending || !question.trim() ? "#9AA0A6" : "#fff",
            border: "none",
            borderRadius: 4,
            padding: "10px 18px",
            fontSize: 13.5,
            fontWeight: 600,
            cursor: isPending || !question.trim() ? "not-allowed" : "pointer",
          }}
        >
          <Send size={15} /> {isPending ? "Asking…" : "Ask"}
        </button>
      </div>

      {/* Honest framing */}
      <p
        style={{
          margin: "10px 0 0",
          fontSize: 12,
          color: "#9AA0A6",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <Info size={13} /> Session log — each question is answered independently (no
        conversational memory).
      </p>
    </div>
  );
}
