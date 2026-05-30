import { useEffect, useRef, useState } from "react";
import { Send, Info, Trash2 } from "lucide-react";
import { useQaStore } from "./store";
import { useAskManual } from "./useAskManual";
import { QaTurn } from "./QaTurn";

const STARTER_QUESTIONS = [
  "How do I replace the engine oil on a 2005 Honda Odyssey?",
  "What is the recommended tire pressure for a 2005 Honda Odyssey?",
  "How do I reset the maintenance minder on a 2005 Honda Odyssey?",
];

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

  // Accepts the question text directly; defaults to the input-box value
  // so the existing text box and Enter key keep working with no changes.
  function submit(questionText = question) {
    const q = (questionText ?? "").trim();
    if (!q || isPending) return;

    setQuestion(q); // reflect the question in the box (covers the chip case)
    ask(q);
    setQuestion("");
  }

  function handleChipClick(q) {
    submit(q);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
            Service Manual RAG Q&amp;A
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 680, marginTop: 6 }}>
            Ask a question about the 2005-2006 Honda Odyssey.
          </p>
          <p style={{ color: "var(--accent)", fontSize: 13, marginTop: 8, margin: 0 }}>
            Source:{" "}
            <a
              href="https://pchenatwork.blob.core.windows.net/files/2005_2006_Honda_Odyssey_Service_Manual.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              2005–2006 Honda Odyssey Factory Shop Service Manual ↓
            </a>
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

      {/* Starter questions (empty state only) */}
      {entries.length === 0 && (
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            New here? Try one of these:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleChipClick(q)}
                disabled={isPending}
                style={{
                  fontSize: 13,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "0.5px solid #ccc",
                  background: "#fff",
                  cursor: isPending ? "default" : "pointer",
                  textAlign: "left",
                  color: "#333",
                }}
              >
                {q.length > 40 ? q.slice(0, 38) + "…" : q}
              </button>
            ))}
          </div>
        </div>
      )}

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
          onClick={() => submit()}
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

      {/* Collapsible architecture panel */}
      <details
        style={{
          marginTop: 24,
          border: "1px solid var(--border-soft)",
          borderRadius: 4,
          padding: 12,
          background: "var(--card-bg)",
        }}
      >
        <summary
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--accent-dark)",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          How it works — architecture overview
        </summary>

        <div style={{ marginTop: 14, color: "var(--text-muted)", fontSize: 13 }}>
          <p>
            A retrieval-augmented generation pipeline. The manual is chunked and embedded
            once; each question retrieves the most relevant passages, which are passed to
            the LLM to ground its answer.
          </p>

          {/* SVG Diagram */}
          <svg viewBox="0 0 680 360" style={{ width: "100%", marginTop: 12 }}>
            {/* Query flow section */}
            <text x="20" y="40" fontSize="14" fontWeight="600" fill="var(--accent-dark)">
              Query flow
            </text>

            {[
              { x: 40, fill: "#F1EFE8", t: "Frontend", s: "React · Static Web Apps" },
              { x: 200, fill: "#E6F1FB", t: "API", s: "C# ASP.NET · Render" },
              { x: 360, fill: "#E1F5EE", t: "Vector search", s: "Azure AI Search" },
              { x: 520, fill: "#EEEDFE", t: "LLM", s: "Azure OpenAI · GPT-4o" },
            ].map((b) => (
              <g key={b.x}>
                <rect x={b.x} y="60" width="140" height="80" fill={b.fill} stroke="#ccc" />
                <text
                  x={b.x + 70}
                  y="95"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#333"
                >
                  {b.t}
                </text>
                <text
                  x={b.x + 70}
                  y="120"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#666"
                >
                  {b.s}
                </text>
              </g>
            ))}

            {/* Arrows and labels */}
            <line x1="180" y1="100" x2="200" y2="100" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <line x1="340" y1="100" x2="360" y2="100" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <line x1="500" y1="100" x2="520" y2="100" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrowhead)" />

            <text x="190" y="55" fontSize="11" fill="#999" textAnchor="middle">
              1. question
            </text>
            <text x="350" y="55" fontSize="11" fill="#999" textAnchor="middle">
              2. embed + retrieve
            </text>
            <text x="560" y="55" fontSize="11" fill="#999" textAnchor="middle">
              3. grounded answer
            </text>

            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#999" />
              </marker>
            </defs>

            {/* Ingestion section */}
            <text x="20" y="200" fontSize="14" fontWeight="600" fill="var(--accent-dark)">
              Ingestion (one-time)
            </text>

            {[
              { x: 40, w: 150, fill: "#FAEEDA", t: "PDF source", s: "Blob Storage" },
              { x: 250, w: 180, fill: "#FAECE7", t: "Chunk + embed", s: "text-embedding-3-small" },
              { x: 490, w: 150, fill: "#E1F5EE", t: "Vector store", s: "Azure AI Search" },
            ].map((b) => (
              <g key={b.x}>
                <rect x={b.x} y="220" width={b.w} height="80" fill={b.fill} stroke="#ccc" />
                <text
                  x={b.x + b.w / 2}
                  y="255"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#333"
                >
                  {b.t}
                </text>
                <text
                  x={b.x + b.w / 2}
                  y="280"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#666"
                >
                  {b.s}
                </text>
              </g>
            ))}

            {/* Arrows for ingestion */}
            <line x1="190" y1="260" x2="250" y2="260" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <line x1="430" y1="260" x2="490" y2="260" stroke="#999" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
          </svg>

          <p style={{ marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--accent-dark)" }}>Design notes:</strong>
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              <strong>Render over AKS</strong> — Kubernetes was overkill and over-budget
              for a single API; the free tier covers the demo.
            </li>
            <li>
              <strong>Azure Static Web Apps</strong> — keeps the whole stack Azure-native
              for a cohesive interview story.
            </li>
            <li>
              <strong>AI Search free tier</strong> — vector search without standing
              infrastructure cost.
            </li>
          </ul>
          <p style={{ marginTop: 12, fontSize: 11, color: "#9AA0A6" }}>
            Secrets in Azure Key Vault · personal subscription (no managed identity / VNet)
          </p>
        </div>
      </details>
    </div>
  );
}
