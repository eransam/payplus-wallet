import { Link } from "react-router-dom";

type DemoLinkProps = {
  to: string;
  label: string;
};

function DemoLink({ to, label }: DemoLinkProps) {
  return (
    <p className="mb-0 mt-3">
      <Link to={to} className="btn btn-eb-primary btn-sm">
        {label} →
      </Link>
    </p>
  );
}

export default DemoLink;
