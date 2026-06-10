import {
  Cloud,
  Server,
  Atom,
  FileText,
  Mail,
  Linkedin,
  Github,
} from "lucide-react";
import { Link } from "react-router-dom";

// Combined "About Me" — title banner, bio, skill cards, contact (one scroll).

interface SkillCard {
  label: string;
  headline: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  tags: string[];
}

// Tags shown on each card; a trailing "…" chip indicates more exist (indicative only).
const skills: SkillCard[] = [
  {
    label: "Cloud & AI",
    headline: "Azure + GenAI",
    icon: Cloud,
    tags: ["Azure OpenAI", "AI Search", "RAG", "Azure Functions", "Azure SQL"],
  },
  {
    label: "Backend",
    headline: "C# / .NET",
    icon: Server,
    tags: ["ASP.NET Core", "SQL", "EF Core", "RESTful APIs", "microservices"],
  },
  {
    label: "Frontend",
    headline: "React",
    icon: Atom,
    tags: ["TypeScript", "Redux", "Tailwind", "Vite", "Tanstack Query"],
  },
];

const tagStyle: React.CSSProperties = {
  fontSize: 11,
  background: "var(--crumb-bg)",
  color: "var(--accent)",
  borderRadius: 3,
  padding: "2px 7px",
};

const moreChipStyle: React.CSSProperties = {
  fontSize: 11,
  background: "#F1EFE8",
  color: "var(--text-muted)",
  borderRadius: 3,
  padding: "2px 7px",
};

const link: React.CSSProperties = {
  color: "var(--accent)",
  fontSize: 14.5,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

export function AboutMe() {
  return (
    <div>
      {/* ---- Title banner ---- */}
      <h1
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: "var(--accent-dark)",
          margin: 0,
        }}
      >
        Paul J. Chen
      </h1>
      <div
        style={{
          fontSize: 13.5,
          color: "var(--accent)",
          fontWeight: 500,
          marginTop: 4,
        }}
      >
        Full-Stack Software Engineer{" "}
        <span style={{ color: "var(--nav-text)" }}>·</span> C# / .NET{" "}
        <span style={{ color: "var(--nav-text)" }}>·</span> React / TypeScript{" "}
        <span style={{ color: "var(--nav-text)" }}>·</span> Azure{" "}
        <span style={{ color: "var(--nav-text)" }}>·</span> GenAI
      </div>

      {/* ---- Bio ---- */}
      <div
        style={{
          maxWidth: 620,
          marginTop: 18,
          fontSize: 14.5,
          color: "var(--text)",
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: "0 0 14px" }}>
          I'm a software engineer by trade and a builder by nature. I write C# /
          .NET, SQL, and React / TypeScript for a living, and the instinct
          behind it doesn't clock out at the end of the day: I like to
          understand how things work and fix them myself.
        </p>
        <p style={{ margin: "0 0 14px" }}>
          That instinct shows up everywhere. I'm also a fairly capable shadetree
          mechanic, and one of my long-running projects is keeping my 2006 Honda
          Odyssey on the road — which means a lot of quality time with service
          manuals. The{" "}
          <Link
            to="/projects/rag-qa"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            Service Manual RAG assistant
          </Link>{" "}
          on this site started as a tool for exactly that. Instead of digging
          through a 2,700-page manual for a torque spec or a reset procedure, I
          can just ask, and get the answer in seconds. It's a fully functional
          retrieval-augmented application: it ingests the manuals, indexes them
          with Azure AI Search, and answers natural-language questions with
          Azure OpenAI. It showcases the GenAI and cloud-native work I do
          professionally, but I built it because I actually use it.
        </p>
        <p style={{ margin: 0 }}>
          That's the theme here. The projects in the showcase are things I made
          because I wanted them to exist, then made robust enough to rely on —
          and they double as a window into how I work as an engineer. Have a
          look around, and if you'd like to talk shop (software or otherwise),
          I'm easy to reach below.
        </p>
      </div>

      {/* ---- Skill cards ---- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginTop: 22,
        }}
      >
        {skills.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: "var(--card-bg)",
                border: "0.5px solid var(--border-soft)",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 10,
                }}
              >
                <Icon size={19} color="var(--accent)" />
                <span
                  style={{
                    fontSize: 11.5,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--accent-dark)",
                  marginBottom: 10,
                }}
              >
                {s.headline}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {s.tags.map((t) => (
                  <span key={t} style={tagStyle}>
                    {t}
                  </span>
                ))}
                <span style={moreChipStyle} aria-label="more technologies">
                  …
                </span>
              </div>
            </div>
          );
        })}
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
          border: "0.5px solid var(--border-soft)",
          borderRadius: 8,
          padding: "16px 20px",
          marginTop: 12,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxWidth: 420,
        }}
      >
        <a href="/resume.pdf" target="_blank" rel="noopener" style={link}>
          <FileText size={17} /> Download resume (PDF)
        </a>
        <a href="mailto:pchenatwork@gmail.com" style={link}>
          <Mail size={17} /> Email
        </a>
        <a
          href="https://linkedin.com/in/paul-j-chen/"
          target="_blank"
          rel="noopener"
          style={link}
        >
          <Linkedin size={17} /> LinkedIn
        </a>
        <a
          href="https://github.com/pchenatwork/fullstack-ai-lab"
          target="_blank"
          rel="noopener"
          style={link}
        >
          <Github size={17} /> GitHub
        </a>
      </div>
    </div>
  );
}
