import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Breadcrumb } from "./Breadcrumb";

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/*
        Desktop (>820px): the shell is a fixed-height viewport. Sidebar and
        breadcrumb stay pinned; only the content area scrolls.
        Mobile (<=820px): the sidebar stacks on top and the page scrolls
        normally (no hard 100vh trap).
      */}
      <style>{`
        .app-shell {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }
        .app-main {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
        }
        @media (max-width: 820px) {
          .app-shell {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }
          .app-shell aside { width: 100% !important; }
          .app-content { overflow: visible !important; }
          .app-main { overflow-y: visible; }
          .sidebar-mobile-toggle { display: inline-flex !important; }
          .sidebar-nav { display: none !important; }
          .sidebar-nav.open { display: flex !important; }
        }
      `}</style>

      <div className="app-shell">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((o) => !o)}
        />

        <div
          className="app-content"
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Breadcrumb />
          <main className="app-main">
            <div style={{ maxWidth: 1100 }}>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
