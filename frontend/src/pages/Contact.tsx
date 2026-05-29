// Stub — flesh out later. Resume download + contact links.

export function Contact() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
        Contact
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 680, marginTop: 8 }}>
        (Placeholder contact page — to be expanded.)
      </p>
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-soft)",
          borderRadius: 4,
          padding: "20px 22px",
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <a href="/resume.pdf" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
          Download resume (PDF)
        </a>
        <a href="mailto:you@example.com" style={{ color: "var(--accent)" }}>
          you@example.com
        </a>
        <a href="https://linkedin.com/in/" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
          LinkedIn
        </a>
        <a href="https://github.com/" target="_blank" rel="noopener" style={{ color: "var(--accent)" }}>
          GitHub
        </a>
      </div>
    </div>
  );
}
