import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PIN_STORAGE_KEY = "payplus-sidebar-pinned";

type AppSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navItems = [
  { to: "/dashboard", label: "לוח בקרה", icon: "⌂" },
  { to: "/merchants", label: "סוחרים", icon: "🏪" },
  { to: "/wallets", label: "ארנקים", icon: "💳" },
  { to: "/transactions", label: "עסקאות", icon: "↔" },
  { to: "/learn", label: "למידה", icon: "📚" },
];

function readPinnedState() {
  return localStorage.getItem(PIN_STORAGE_KEY) === "1";
}

function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(readPinnedState);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 991px)").matches);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 991px)");
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const togglePin = useCallback(() => {
    setIsPinned((pinned) => {
      const next = !pinned;
      localStorage.setItem(PIN_STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
    onClose();
  }, [logout, navigate, onClose]);

  return (
    <>
      <div
        className={`app-sidebar__backdrop ${isOpen ? "app-sidebar__backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={[
          "app-sidebar",
          isOpen ? "app-sidebar--open" : "",
          isPinned ? "app-sidebar--pinned" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="app-sidebar__mobile-header">
          <span>תפריט</span>
          <button type="button" className="app-sidebar__close-btn" onClick={onClose} aria-label="סגור תפריט">
            ✕
          </button>
        </div>

        <nav className="app-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `app-sidebar__link${isActive ? " active" : ""}`
              }
              onClick={handleNavClick}
              end={item.to === "/dashboard"}
            >
              <span className="app-sidebar__icon">{item.icon}</span>
              <span className="app-sidebar__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {!isMobile && (
          <div className="app-sidebar__rail-tools">
            <button
              type="button"
              className="app-sidebar__pin"
              onClick={togglePin}
              aria-pressed={isPinned}
              title={isPinned ? "כיווץ לרצועה (פתיחה במעבר עכבר)" : "הרחבה קבועה"}
            >
              <span className="app-sidebar__icon" aria-hidden="true">
                {isPinned ? "📌" : "«"}
              </span>
              <span className="app-sidebar__label app-sidebar__label--pin">
                {isPinned ? "מצב מורחב קבוע" : "הרחבה קבועה"}
              </span>
            </button>
          </div>
        )}

        <div className="app-sidebar__footer">
          <button type="button" className="app-sidebar__logout" onClick={handleLogout} title="התנתקות">
            <span className="app-sidebar__icon" aria-hidden="true">
              ↪
            </span>
            <span className="app-sidebar__label">התנתקות</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AppSidebar;
