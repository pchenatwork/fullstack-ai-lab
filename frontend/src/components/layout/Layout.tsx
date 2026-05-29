import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Responsive rules: below 820px the sidebar becomes full-width with a
          hamburger toggle, and the nav hides unless opened. */}
      <style>{`
        @media (max-width: 820px) {
          .app-shell { flex-direction: column !important; }
          .app-shell aside { width: 100% !important; }
          .sidebar-mobile-toggle { display: inline-flex !important; }
          .sidebar-nav { display: none !important; }
          .sidebar-nav.open { display: flex !important; }
        }
      `}</style>

      <div className="app-shell" style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((o) => !o)}
        />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Breadcrumb />
          <main style={{ padding: 28, maxWidth: 1100 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
