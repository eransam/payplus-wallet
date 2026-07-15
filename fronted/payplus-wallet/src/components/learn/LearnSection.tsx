import type { ReactNode } from "react";

type LearnSectionProps = {
  title: string;
  children: ReactNode;
  variant?: "default" | "notebook";
};

function LearnSection({ title, children, variant = "default" }: LearnSectionProps) {
  return (
    <section
      className={`learn-section${variant === "notebook" ? " learn-notebook" : ""}`}
    >
      <h2 className="learn-section__title">{title}</h2>
      {children}
    </section>
  );
}

export default LearnSection;
