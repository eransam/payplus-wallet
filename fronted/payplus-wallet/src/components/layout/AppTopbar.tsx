import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type AppTopbarProps = {
  onMenuToggle: () => void;
};

function AppTopbar({ onMenuToggle }: AppTopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="app-topbar">
      <div className="app-topbar__left">
        <button
          type="button"
          className="app-topbar__menu-btn"
          onClick={onMenuToggle}
          aria-label="פתח תפריט"
        >
          ☰
        </button>
        <Link to="/dashboard" className="app-topbar__brand">
          PayPlus ארנק
        </Link>
      </div>
      <div className="app-topbar__user">
        <span className="app-topbar__user-name">{user?.full_name}</span>
        <button type="button" className="app-topbar__logout" onClick={logout} title="התנתקות">
          <span className="app-topbar__logout-icon" aria-hidden="true">
            ↪
          </span>
          <span className="app-topbar__logout-text">התנתקות</span>
        </button>
      </div>
    </header>
  );
}

export default AppTopbar;
