import { useState } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <ScrollToTop />
      <AppTopbar onMenuToggle={() => setSidebarOpen((open) => !open)} />
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
