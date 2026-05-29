// Stub — flesh out later with full intro content.

const tile: React.CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--border-soft)",
  borderRadius: 4,
  padding: "16px 18px",
};

export function Home() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
        Paul Chen
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 680, marginTop: 8 }}>
        Full-stack engineer building cloud-native AI applications on Azure. C# / .NET on the
        backend, React on the front. (Placeholder home page — to be expanded.)
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
    </div>
  );
}
