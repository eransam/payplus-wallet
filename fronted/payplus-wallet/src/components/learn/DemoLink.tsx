import { Link } from "react-router-dom";

type DemoLinkProps = {
  to: string;
  label: string;
};

function DemoLink({ to, label }: DemoLinkProps) {
  return (
    <p>
      <Link to={to} className="btn btn-outline-primary btn-sm">
        {label} →
      </Link>
    </p>
  );
}

export default DemoLink;
