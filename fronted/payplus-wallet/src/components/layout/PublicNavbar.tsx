import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="public-navbar">
      <Link to="/" className="public-navbar__brand">
        <span className="public-navbar__logo">P+</span>
        <span>PayPlus ארנק</span>
      </Link>
      <div className="public-navbar__actions">
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-eb-primary">
            לוח הבקרה
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-eb-outline">
              כניסה
            </Link>
            <Link to="/register" className="btn btn-eb-primary">
              הרשמה
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default PublicNavbar;
