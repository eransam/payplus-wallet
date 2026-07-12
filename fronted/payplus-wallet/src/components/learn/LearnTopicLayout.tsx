import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type LearnTopicLayoutProps = {
  title: string;
  lesson: number;
  children: ReactNode;
};

function LearnTopicLayout({ title, lesson, children }: LearnTopicLayoutProps) {
  return (
    <div>
      <Link to="/learn" className="text-decoration-none d-inline-block mb-3">
        ← חזרה למרכז הלמידה
      </Link>
      <p className="text-muted mb-1">שיעור {lesson}</p>
      <h1 className="mb-4">{title}</h1>
      {children}
    </div>
  );
}

export default LearnTopicLayout;
