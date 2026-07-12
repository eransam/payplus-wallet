import { Link } from "react-router-dom";

type DashboardStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: string;
  to?: string;
  accent?: "purple" | "blue" | "green" | "orange";
};

function DashboardStatCard({
  label,
  value,
  hint,
  icon,
  to,
  accent = "purple",
}: DashboardStatCardProps) {
  const content = (
    <div className={`dashboard-stat dashboard-stat--${accent}`}>
      <div className="dashboard-stat__icon" aria-hidden="true">
        {icon}
      </div>
      <div className="dashboard-stat__body">
        <span className="dashboard-stat__label">{label}</span>
        <strong className="dashboard-stat__value">{value}</strong>
        {hint && <span className="dashboard-stat__hint">{hint}</span>}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="dashboard-stat-link">
        {content}
      </Link>
    );
  }

  return content;
}

export default DashboardStatCard;
