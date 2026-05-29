// Combined "About Me" — intro/bio on top, contact below (one scroll).

const tile: React.CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--border-soft)",
  borderRadius: 4,
  padding: "16px 18px",
};

const link: React.CSSProperties = { color: "var(--accent)" };

export function AboutMe() {
  return (
    <div>
      {/* ---- Intro / bio ---- */}
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
        Paul J. Chen
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 680, marginTop: 8 }}>
        Full-stack engineer building cloud-native AI applications on Azure. C# / .NET on the
        backend, React on the front. (Placeholder bio — to be expanded.)
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 14,
          marginTop: 20,
        }}
      >
        <div style={tile}>
          <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 6 }}>Focus</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-dark)" }}>
            Cloud + AI
          </div>
        </div>
        <div style={tile}>
          <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 6 }}>Backend</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-dark)" }}>.NET</div>
        </div>
        <div style={tile}>
          <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 6 }}>Frontend</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "var(--accent-dark)" }}>React</div>
        </div>
      </div>

      {/* ---- Contact ---- */}
      <h2
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "var(--accent-dark)",
          margin: "32px 0 0",
        }}
      >
        Get in touch
      </h2>
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-soft)",
          borderRadius: 4,
          padding: "20px 22px",
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <a href="/resume.pdf" target="_blank" rel="noopener" style={link}>
          Download resume (PDF)
        </a>
        {/*
        <a href="mailto:you@example.com" style={link}>
          you@example.com
        </a> */}
        <a href="https://linkedin.com/in/paul-j-chen/" target="_blank" rel="noopener" style={link}>
          LinkedIn
        </a>
        <a href="https://github.com/pchenatwork/fullstack-ai-lab" target="_blank" rel="noopener" style={link}>
          GitHub
        </a>
      </div>
    </div>
  );
}
