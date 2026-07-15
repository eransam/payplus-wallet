import type { ReactNode } from "react";

type LearnCalloutProps = {
  variant?: "tip" | "warn" | "info";
  title?: string;
  children: ReactNode;
};

function LearnCallout({ variant = "info", title, children }: LearnCalloutProps) {
  return (
    <div className={`learn-callout learn-callout--${variant}`}>
      {title ? <span className="learn-callout__title">{title}</span> : null}
      {children}
    </div>
  );
}

export default LearnCallout;
