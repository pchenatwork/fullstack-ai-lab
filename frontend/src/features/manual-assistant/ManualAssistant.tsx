import { useEffect, useRef, useState } from "react";
import { Send, Info, Trash2, X } from "lucide-react";
import { useQaStore } from "./store";
import { useAskManual } from "./useAskManual";
import { QaTurn } from "./QaTurn";

const STARTER_QUESTIONS = [
  "How do I replace the engine oil on a 2005 Honda Odyssey?",
  "What is the recommended tire pressure for a 2005 Honda Odyssey?",
  "How do I reset the maintenance minder on a 2005 Honda Odyssey?",
];

// Generate a harder math puzzle
function generatePuzzle() {
  const operation = Math.floor(Math.random() * 3); // 0=add, 1=subtract, 2=multiply
  
  let question: string;
  let answer: number;
  
  if (operation === 0) {
    // Addition with larger numbers
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    question = `${num1} + ${num2} = ?`;
    answer = num1 + num2;
  } else if (operation === 1) {
    // Subtraction
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const larger = Math.max(num1, num2);
    const smaller = Math.min(num1, num2);
    question = `${larger} − ${smaller} = ?`;
    answer = larger - smaller;
  } else {
    // Multiplication with smaller numbers
    const num1 = Math.floor(Math.random() * 12) + 2;
    const num2 = Math.floor(Math.random() * 12) + 2;
    question = `${num1} × ${num2} = ?`;
    answer = num1 * num2;
  }
  
  return { question, answer };
}

export function ManualAssistant() {
  const entries = useQaStore((s) => s.entries);
  const clear = useQaStore((s) => s.clear);
  const { ask, isPending } = useAskManual();

  const [question, setQuestion] = useState("");
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzle, setPuzzle] = useState(generatePuzzle());
  const [userAnswer, setUserAnswer] = useState("");
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [puzzleError, setPuzzleError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest entry whenever the log changes.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  function openDownloadPuzzle() {
    const newPuzzle = generatePuzzle();
    setPuzzle(newPuzzle);
    setUserAnswer("");
    setPuzzleError("");
    setPuzzleSolved(false);
    setShowPuzzle(true);
  }

  function verifyPuzzle() {
    const answer = parseInt(userAnswer.trim(), 10);
    if (isNaN(answer)) {
      setPuzzleError("Please enter a number");
      return;
    }
    if (answer === puzzle.answer) {
      setPuzzleSolved(true);
      setTimeout(() => {
        // Trigger download after short delay
        window.open(
          "https://stautorepairmanuals.blob.core.windows.net/repairmanuals/05-06%20Odyssey%20Service%20Manual.pdf",
          "_blank"
        );
        setShowPuzzle(false);
      }, 300);
    } else {
      setPuzzleError("Incorrect answer, try again");
      setUserAnswer("");
    }
  }

  function closePuzzleModal() {
    setShowPuzzle(false);
    setUserAnswer("");
    setPuzzleError("");
  }

  // Accepts the question text directly; defaults to the input-box value
  // so the existing text box and Enter key keep working with no changes.
  function submit(questionText = question) {
    const q = (questionText ?? "").trim();
    if (!q || isPending) return;

    setQuestion(q); // reflect the question in the box (covers the chip case)
    ask(q);
    setQuestion("");
  }

  function handleChipClick(q: string) {
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
            <button
              onClick={openDownloadPuzzle}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                textDecoration: "underline",
                cursor: "pointer",
                fontSize: 13,
                padding: 0,
                fontFamily: "inherit",
              }}
            >
              2005–2006 Honda Odyssey Factory Shop Service Manual ↓
            </button>
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
              { x: 40, fill: "#F1EFE8", t: "Frontend", s: "React · Azure Static Web Apps" },
              { x: 200, fill: "#E6F1FB", t: "API", s: "C# ASP.NET · Render.com" },
              { x: 360, fill: "#E1F5EE", t: "Retrieval Layer", s: "Azure AI Search · Hybrid + Vector Search" },
              { x: 520, fill: "#EEEDFE", t: "LLM", s: "Azure OpenAI · GPT-4.1-mini" },
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
              { x: 40, w: 150, fill: "#FAEEDA", t: "PDF source", s: "Azure Blob Storage" },
              { x: 250, w: 180, fill: "#FAECE7", t: "Chunk + embed", s: "text-embedding-3-large" },
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
            <strong style={{ color: "var(--accent-dark)" }}>Project notes:</strong>
          </p>
          <ul style={{ marginTop: 8, paddingLeft: 20, lineHeight: 1.6 }}>
            <li>
              <strong>Frontend - Azure Static Web Apps</strong> — Free tier.
            </li>
            <li>
              <strong>WebAPI - Render.com</strong> — Free tier. Downside is, it takes 40+ seconds to cold start when first called.
            </li>
            <li>
              <strong>AI Search free tier</strong> — vector search without standing infrastructure cost.
            </li>
          </ul>
          <p style={{ marginTop: 12, fontSize: 11, color: "#9AA0A6" }}>
            Secrets in Azure Key Vault · personal subscription (no managed identity / VNet)
          </p>
        </div>
      </details>

      {/* Puzzle Modal */}
      {showPuzzle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closePuzzleModal}
        >
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 8,
              padding: 32,
              maxWidth: 400,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--accent-dark)" }}>
                Verify you're human
              </h2>
              <button
                onClick={closePuzzleModal}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: 0,
                  display: "flex",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {!puzzleSolved ? (
              <>
                <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
                  Solve this simple puzzle to download the manual:
                </p>

                <div
                  style={{
                    background: "var(--card-bg)",
                    border: "2px solid var(--border-soft)",
                    borderRadius: 6,
                    padding: 16,
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  <p style={{ fontSize: 20, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
                    {puzzle.question}
                  </p>
                </div>

                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setPuzzleError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && verifyPuzzle()}
                  placeholder="Your answer"
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `1px solid ${puzzleError ? "#d32f2f" : "var(--border)"}`,
                    borderRadius: 4,
                    fontSize: 14,
                    fontFamily: "var(--font)",
                    marginBottom: 8,
                    boxSizing: "border-box",
                  }}
                />

                {puzzleError && (
                  <p style={{ fontSize: 12, color: "#d32f2f", marginBottom: 16, margin: 0 }}>
                    {puzzleError}
                  </p>
                )}

                <button
                  onClick={verifyPuzzle}
                  style={{
                    width: "100%",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 4,
                    padding: "10px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Verify & Download
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600, marginBottom: 8 }}>
                  ✓ Correct!
                </p>
                <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
                  Your download should start shortly...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
