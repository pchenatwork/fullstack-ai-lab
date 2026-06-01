import type { QaEntry } from "./types";

// Renders one question/answer pair as chat-style bubbles (question right, answer left).
export function QaTurn({ entry }: { entry: QaEntry }) {
  const isError = entry.status === "error";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div
          style={{
            background: "var(--accent)",
            color: "#fff",
            borderRadius: "10px 10px 2px 10px",
            padding: "8px 13px",
            fontSize: 14.5,
            maxWidth: "75%",
          }}
        >
          {entry.question}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div
          style={{
            background: isError ? "#FCEBEB" : "#F1F4F8",
            color: isError ? "#A32D2D" : "var(--text)",
            borderRadius: "10px 10px 10px 2px",
            padding: "8px 13px",
            fontSize: 14.5,
            maxWidth: "80%",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}
        >
          {entry.status === "pending" ? "... Please wait ... Because the Web API is hosted on Render.com's free tier, response might take up to 45 seconds..." : entry.answer}
        </div>
      </div>
    </div>
  );
}
