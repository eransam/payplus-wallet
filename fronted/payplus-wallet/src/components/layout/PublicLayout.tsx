import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";

function PublicLayout() {
  return (
    <div className="public-layout">
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
