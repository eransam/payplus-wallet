import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <section className="landing-hero">
        <div className="landing-hero__inner">
          <div>
            <h1>ניהול ארנקים דיגיטליים בצורה חכמה ובטוחה</h1>
            <p>
              PayPlus ארנק מאפשר לנהל סוחרים, ארנקים ועסקאות במקום אחד — עם ממשק
              מודרני, מהיר ומותאם לעברית.
            </p>
            <div className="landing-hero__actions">
              <Link to="/register" className="btn btn-eb-primary">
                התחל בחינם
              </Link>
              <Link to="/login" className="btn btn-eb-outline">
                כניסה לחשבון
              </Link>
            </div>
          </div>
          <div className="landing-hero__visual">
            <h2 style={{ marginTop: 0 }}>למה PayPlus?</h2>
            <ul style={{ margin: 0, paddingInlineStart: "1.2rem", lineHeight: 1.8 }}>
              <li>ניהול ארנקים ויתרות בזמן אמת</li>
              <li>טעינות והחזרים עם idempotency</li>
              <li>ממשק מקצועי בסגנון EasyBox</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="landing-features">
        <div className="eb-card landing-feature">
          <h3>ארנקים</h3>
          <p>צור ונהל ארנקים, עקוב אחרי יתרות וסטטוס בכל רגע.</p>
        </div>
        <div className="eb-card landing-feature">
          <h3>עסקאות</h3>
          <p>בצע טעינות והחזרים בצורה בטוחה עם מניעת כפילויות.</p>
        </div>
        <div className="eb-card landing-feature">
          <h3>סוחרים</h3>
          <p>נהל סוחרים פעילים וחבר אותם לזרימת התשלומים שלך.</p>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
