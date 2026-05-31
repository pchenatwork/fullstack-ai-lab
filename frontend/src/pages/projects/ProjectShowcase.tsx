import { useNavigate } from "react-router-dom";
import { Bot, Table2, Plus } from "lucide-react";

interface ProjectCard {
  title: string;
  description: string;
  badges: string[];
  to: string;
  icon: React.ComponentType<{ size?: number }>;
}

const projects: ProjectCard[] = [
  {
    title: "Service Manual RAG Q&A",
    description:
      "Ask natural-language questions answered from car service manuals. Azure OpenAI + AI Search retrieval, C# ASP.NET Core API, React front end.",
    badges: ["Azure OpenAI", "AI Search", "RAG", "React"],
    to: "/projects/rag-qa",
    icon: Bot,
  },
  {
    title: "Vehicle Generation Lookup",
    description:
      "Server-side paginated, sortable, searchable table over a vehicle reference dataset. Debounced search, TanStack Query.",
    badges: ["React", "TanStack Query", "Debounce", ".NET API"],
    to: "/projects/vehicles",
    icon: Table2,
  },
];

const card: React.CSSProperties = {
  background: "var(--card-bg)",
  border: "1px solid var(--border-soft)",
  borderLeft: "3px solid var(--accent)",
  borderRadius: 4,
  padding: "18px 20px",
  display: "flex",
  flexDirection: "column",
};

export function ProjectShowcase() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-dark)", margin: 0 }}>
        Project Showcase
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 680, marginTop: 8 }}>
        Personal hobby projects. Click a demo to try it live.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        {projects.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.to} style={card}>
              <h3
                style={{
                  fontSize: 15.5,
                  color: "var(--accent-dark)",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Icon size={18} /> {p.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", flex: 1, marginTop: 8 }}>
                {p.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                {p.badges.map((b) => (
                  <span
                    key={b}
                    style={{
                      background: "var(--crumb-bg)",
                      color: "var(--accent)",
                      border: "1px solid var(--border)",
                      borderRadius: 3,
                      padding: "3px 10px",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <button
                  onClick={() => navigate(p.to)}
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 3,
                    padding: "9px 16px",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Show Demo
                </button>
              </div>
            </div>
          );
        })}

        {/* More to come placeholder */}
        <div
          style={{
            ...card,
            borderLeft: "3px dashed var(--border)",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "var(--text-muted)",
            minHeight: 140,
          }}
        >
          <Plus size={26} />
          <div style={{ marginTop: 6 }}>More projects coming soon</div>
        </div>
      </div>
    </div>
  );
}
