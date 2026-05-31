export function Architecture() {
  return (
    <div style={{ marginTop: 16 }}>
      {/* Disclaimer/Attribution */}
      <div
        style={{
          background: "var(--crumb-bg)",
          border: "0.5px solid var(--border-soft)",
          borderRadius: 6,
          padding: "10px 14px",
          marginBottom: 16,
          fontSize: "12px",
          color: "var(--accent)",
          textAlign: "center",
        }}
      >
        Architecture overview created by Claude Code
      </div>
      <svg
        viewBox="0 0 680 470"
        width="100%"
        role="img"
        aria-label="RAG pipeline diagram showing ingestion and query phases"
        style={{ marginBottom: 20 }}
      >
        {/* Phase 1 — Ingestion (one-time) */}
        <text x="20" y="24" fontSize="14" fontWeight="600" fill="var(--accent-dark)">
          Phase 1 — Ingestion (one-time)
        </text>

        {/* Box 1: PDF manual */}
        <rect x="40" y="44" width="118" height="48" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
        <text x="99" y="59" fontSize="14" fontWeight="500" fill="#2C2C2A" textAnchor="middle">
          PDF manual
        </text>
        <text x="99" y="79" fontSize="12" fill="#2C2C2A" textAnchor="middle">
          ~2,800 pages
        </text>

        {/* Box 2: Chunk */}
        <rect x="194" y="44" width="118" height="48" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
        <text x="253" y="59" fontSize="14" fontWeight="500" fill="#2C2C2A" textAnchor="middle">
          Chunk
        </text>
        <text x="253" y="79" fontSize="12" fill="#2C2C2A" textAnchor="middle">
          ~600 words, 90 overlap
        </text>

        {/* Box 3: Embed */}
        <rect x="348" y="44" width="130" height="48" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
        <text x="413" y="59" fontSize="14" fontWeight="500" fill="#04342C" textAnchor="middle">
          Embed
        </text>
        <text x="413" y="79" fontSize="12" fill="#04342C" textAnchor="middle">
          3-large · 3072-dim
        </text>

        {/* Box 4: Azure AI Search */}
        <rect x="514" y="44" width="126" height="48" fill="#E6F1FB" stroke="#185FA5" strokeWidth="0.5" />
        <text x="577" y="59" fontSize="14" fontWeight="500" fill="#042C53" textAnchor="middle">
          Azure AI Search
        </text>
        <text x="577" y="79" fontSize="12" fill="#042C53" textAnchor="middle">
          950 vectors stored
        </text>

        {/* Arrows between Phase 1 boxes */}
        <line x1="158" y1="68" x2="194" y2="68" stroke="#888780" strokeWidth="0.5" />
        <polygon points="194,68 188,65 188,71" fill="#888780" />

        <line x1="312" y1="68" x2="348" y2="68" stroke="#888780" strokeWidth="0.5" />
        <polygon points="348,68 342,65 342,71" fill="#888780" />

        <line x1="478" y1="68" x2="514" y2="68" stroke="#888780" strokeWidth="0.5" />
        <polygon points="514,68 508,65 508,71" fill="#888780" />

        {/* Divider line */}
        <line x1="20" y1="112" x2="660" y2="112" stroke="#D6E4F5" strokeWidth="1" />

        {/* Phase 2 — Query (every question) */}
        <text x="20" y="140" fontSize="14" fontWeight="600" fill="var(--accent-dark)">
          Phase 2 — Query (every question)
        </text>

        {/* Box 1: Question */}
        <rect x="40" y="156" width="118" height="48" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
        <text x="99" y="171" fontSize="14" fontWeight="500" fill="#2C2C2A" textAnchor="middle">
          Question
        </text>
        <text x="99" y="191" fontSize="12" fill="#2C2C2A" textAnchor="middle">
          React → C# API
        </text>

        {/* Box 2: Embed query */}
        <rect x="194" y="156" width="118" height="48" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
        <text x="253" y="171" fontSize="14" fontWeight="500" fill="#04342C" textAnchor="middle">
          Embed query
        </text>
        <text x="253" y="191" fontSize="12" fill="#04342C" textAnchor="middle">
          same model
        </text>

        {/* Box 3: Retriever (tall box with sub-pills) */}
        <rect x="348" y="148" width="130" height="120" fill="#E6F1FB" stroke="#185FA5" strokeWidth="0.5" />
        <text x="413" y="163" fontSize="14" fontWeight="500" fill="#042C53" textAnchor="middle">
          Retriever
        </text>
        <text x="413" y="183" fontSize="12" fill="#042C53" textAnchor="middle">
          Azure AI Search
        </text>

        {/* Sub-pills inside Retriever */}
        {/* BM25 keyword */}
        <rect x="362" y="192" width="102" height="22" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
        <text x="413" y="204" fontSize="11" fill="#04342C" textAnchor="middle" dominantBaseline="central">
          BM25 keyword
        </text>

        {/* Vector search */}
        <rect x="362" y="217" width="102" height="22" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
        <text x="413" y="229" fontSize="11" fill="#04342C" textAnchor="middle" dominantBaseline="central">
          Vector search
        </text>

        {/* Semantic rank (gray) */}
        <rect x="362" y="242" width="102" height="22" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
        <text x="413" y="254" fontSize="11" fill="#2C2C2A" textAnchor="middle" dominantBaseline="central">
          Semantic rank*
        </text>

        {/* Box 4: GPT-4o */}
        <rect x="514" y="156" width="126" height="48" fill="#FAEEDA" stroke="#854F0B" strokeWidth="0.5" />
        <text x="577" y="171" fontSize="14" fontWeight="500" fill="#412402" textAnchor="middle">
          GPT-4o
        </text>
        <text x="577" y="191" fontSize="12" fill="#412402" textAnchor="middle">
          top-5 chunks → answer
        </text>

        {/* Vertical arrow from GPT-4o down to Grounded answer */}
        <line x1="577" y1="204" x2="577" y2="248" stroke="#888780" strokeWidth="0.5" />
        <polygon points="577,248 574,242 580,242" fill="#888780" />

        {/* Arrows between Phase 2 boxes */}
        <line x1="158" y1="180" x2="194" y2="180" stroke="#888780" strokeWidth="0.5" />
        <polygon points="194,180 188,177 188,183" fill="#888780" />

        <line x1="312" y1="180" x2="348" y2="180" stroke="#888780" strokeWidth="0.5" />
        <polygon points="348,180 342,177 342,183" fill="#888780" />

        <line x1="478" y1="180" x2="514" y2="180" stroke="#888780" strokeWidth="0.5" />
        <polygon points="514,180 508,177 508,183" fill="#888780" />

        {/* Box 5: Grounded answer */}
        <rect x="514" y="248" width="126" height="44" fill="#F1EFE8" stroke="#B4B2A9" strokeWidth="0.5" />
        <text x="577" y="267" fontSize="14" fontWeight="500" fill="#2C2C2A" textAnchor="middle">
          Grounded answer
        </text>

        {/* Footnotes */}
        <text x="20" y="330" fontSize="12" fill="var(--text-muted)">
          * Semantic ranker is wired but Free-tier-gated (needs Basic+).
        </text>
        <text x="20" y="350" fontSize="12" fill="var(--text-muted)">
          Vectors live in the index; the LLM only sees the retrieved chunks — answers are grounded, not invented.
        </text>
      </svg>

      {/* Part B — Metrics Panel */}
      <div
        style={{
          background: "var(--page-bg)",
          borderRadius: 12,
          padding: 20,
          marginTop: 20,
        }}
      >
        <div
          style={{
            fontSize: "11.5px",
            fontWeight: 600,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 16,
          }}
        >
          Project metrics
        </div>

        {/* Stat cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {/* Card 1: Source manual */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid var(--border-soft)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--accent)", marginBottom: 4 }}>
              Source manual
            </div>
            <div style={{ fontSize: "21px", fontWeight: 500, color: "var(--accent-dark)" }}>
              ~2,800 pp
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: 4 }}>
              2,732 extracted
            </div>
          </div>

          {/* Card 2: Indexed chunks */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid var(--border-soft)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--accent)", marginBottom: 4 }}>
              Indexed chunks
            </div>
            <div style={{ fontSize: "21px", fontWeight: 500, color: "var(--accent-dark)" }}>
              950
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: 4 }}>
              ~600-word, 90 overlap
            </div>
          </div>

          {/* Card 3: Embeddings */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid var(--border-soft)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--accent)", marginBottom: 4 }}>
              Embeddings
            </div>
            <div style={{ fontSize: "21px", fontWeight: 500, color: "var(--accent-dark)" }}>
              3,072-dim
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: 4 }}>
              text-embedding-3-large
            </div>
          </div>

          {/* Card 4: Response time */}
          <div
            style={{
              background: "#fff",
              border: "0.5px solid var(--border-soft)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "var(--accent)", marginBottom: 4 }}>
              Response time
            </div>
            <div style={{ fontSize: "21px", fontWeight: 500, color: "var(--accent-dark)" }}>
              ~1–3 s
            </div>
            <div style={{ fontSize: "11.5px", color: "var(--text-muted)", marginTop: 4 }}>
              ~1.8 s avg (warm)
            </div>
          </div>
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>Stack:</span>
            {[
              { label: "Hybrid retrieval (BM25 + vector)", muted: false },
              { label: "GPT-4o", muted: false },
              { label: "Azure AI Search", muted: false },
              { label: "top-5 grounding", muted: false },
              { label: "Free tier · 38.5/50 MB", muted: true },
            ].map((chip, idx) => (
              <div
                key={idx}
                style={{
                  fontSize: "11.5px",
                  background: chip.muted ? "#F1EFE8" : "var(--crumb-bg)",
                  color: chip.muted ? "var(--text-muted)" : "var(--accent)",
                  borderRadius: 3,
                  padding: "3px 9px",
                }}
              >
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
