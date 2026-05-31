import { useEffect, useRef, useState } from "react";
import { Send, Info, Trash2, X } from "lucide-react";
import { useQaStore } from "./store";
import { useAskManual } from "./useAskManual";
import { QaTurn } from "./QaTurn";
import { Architecture } from "./Architecture";

const STARTER_QUESTIONS = [
  "How do I replace the engine oil?",
  "What does P0420 mean and how do I fix it?",
  "How do I reset the maintenance minder?",
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

  const [tab, setTab] = useState("assistant");
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
            Honda Odyssey 05-06 Service Manual RAG Q&amp;A
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 750, marginTop: 6 }}>
            Ask about the 2005–2006 Honda Odyssey. Answers are based on the service manual here, not general training data.
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

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 20, marginTop: 16, borderBottom: "1px solid var(--border-soft)" }}>
        {(["assistant", "architecture"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
              color: tab === t ? "var(--accent-dark)" : "var(--text-muted)",
              fontWeight: tab === t ? 600 : 400,
              fontSize: 14,
              padding: "8px 4px",
              cursor: "pointer",
              marginBottom: "-1px",
            }}
          >
            {t === "assistant" ? "Assistant" : "Architecture"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "assistant" ? (
        <>
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
                {q.length > 70 ? q.slice(0, 68) + "…" : q}
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
        </>
      ) : (
        <Architecture />
      )}

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
                Before download, verify you're human
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
