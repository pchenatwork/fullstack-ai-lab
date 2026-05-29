import { NavLink, useLocation } from "react-router-dom";
import { Home, FolderKanban, Mail, ChevronLeft, Menu } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
}

const navItems = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/projects", label: "Project Showcase", icon: FolderKanban, end: false },
  { to: "/contact", label: "Contact", icon: Mail, end: true },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onToggleMobile,
}: SidebarProps) {
  const location = useLocation();

  // "Project Showcase" stays active for any /projects* route (including demos).
  function isActive(to: string, end: boolean) {
    if (end) return location.pathname === to;
    return location.pathname === to || location.pathname.startsWith(to + "/");
  }

  return (
    <aside
      style={{
        width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
        background: "var(--nav-bg)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      {/* Identity / top bar */}
      <div
        onClick={() => {
          if (collapsed) onToggleCollapse();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? "16px 8px" : "16px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          gap: 10,
          cursor: collapsed ? "pointer" : "default",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "var(--accent)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            PC
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
                Paul Chen
              </div>
              <div style={{ color: "var(--nav-text)", fontSize: 11.5 }}>
                Cloud &amp; AI Engineer
              </div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse();
            }}
            aria-label="Collapse sidebar"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--nav-text-bright)",
              padding: "4px 6px",
              borderRadius: 4,
              display: "flex",
            }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Mobile toggle (shown via CSS on small screens — see Layout) */}
      <button
        onClick={onToggleMobile}
        aria-label="Toggle menu"
        className="sidebar-mobile-toggle"
        style={{
          display: "none",
          alignItems: "center",
          gap: 8,
          margin: "10px",
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: 4,
          padding: "8px 12px",
          fontSize: 13,
          cursor: "pointer",
        }}
      >
        <Menu size={16} /> Menu
      </button>

      {/* Nav */}
      <nav
        className={mobileOpen ? "sidebar-nav open" : "sidebar-nav"}
        style={{ padding: "10px 8px", display: "flex", flexDirection: "column", gap: 3 }}
      >
        {navItems.map(({ to, label, icon: Icon, end }) => {
          const active = isActive(to, end);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobileOpen && onToggleMobile()}
              title={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: collapsed ? "11px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 4,
                fontSize: 14,
                whiteSpace: "nowrap",
                background: active ? "var(--accent)" : "transparent",
                color: active ? "#fff" : "var(--nav-text)",
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={17} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {!collapsed && (
        <div
          style={{
            marginTop: "auto",
            padding: "16px 18px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            color: "var(--nav-text)",
            fontSize: 11,
            whiteSpace: "nowrap",
          }}
        >
          Built on Azure Static Web Apps
        </div>
      )}
    </aside>
  );
}
