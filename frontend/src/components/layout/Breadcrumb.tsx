import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Maps the current route to breadcrumb segments.
// Rules (from spec): no "Home" prefix; leaf pages show only their own name;
// deepest nesting is "Project Showcase > [Demo]"; "Project Showcase" links to /projects.

interface Crumb {
  label: string;
  to?: string; // present => clickable
}

const demoLabels: Record<string, string> = {
  "rag-qa": "Service Manual RAG Q&A",
  vehicles: "Vehicle Generation Lookup",
};

function buildCrumbs(pathname: string): Crumb[] {
  if (pathname === "/") return [{ label: "Home" }];
  if (pathname === "/contact") return [{ label: "Contact" }];

  if (pathname === "/projects") return [{ label: "Project Showcase" }];

  if (pathname.startsWith("/projects/")) {
    const demoKey = pathname.replace("/projects/", "");
    const demoLabel = demoLabels[demoKey] ?? demoKey;
    return [
      { label: "Project Showcase", to: "/projects" },
      { label: demoLabel },
    ];
  }

  return [{ label: "Home" }];
}

export function Breadcrumb() {
  const { pathname } = useLocation();
  const crumbs = buildCrumbs(pathname);

  return (
    <div
      style={{
        background: "var(--crumb-bg)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 28px",
        fontSize: 13,
        color: "var(--accent)",
        display: "flex",
        alignItems: "center",
        gap: 7,
        flexWrap: "wrap",
      }}
    >
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {c.to && !isLast ? (
              <Link to={c.to} style={{ color: "var(--accent)" }}>
                {c.label}
              </Link>
            ) : (
              <span
                style={{
                  color: isLast ? "var(--accent-dark)" : "var(--accent)",
                  fontWeight: isLast ? 600 : 400,
                }}
              >
                {c.label}
              </span>
            )}
            {!isLast && <ChevronRight size={13} style={{ opacity: 0.55 }} />}
          </span>
        );
      })}
    </div>
  );
}
