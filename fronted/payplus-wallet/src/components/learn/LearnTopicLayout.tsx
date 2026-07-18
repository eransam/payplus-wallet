import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  getAdjacentTopics,
  getTopicBySlug,
  getTrackForSlug,
} from "../../data/learnTopics";

type LearnTopicLayoutProps = {
  slug: string;
  children: ReactNode;
  objectives?: string[];
};

function LearnTopicLayout({ slug, children, objectives }: LearnTopicLayoutProps) {
  const topic = getTopicBySlug(slug);
  const track = getTrackForSlug(slug);
  const { prev, next } = getAdjacentTopics(slug);

  if (!topic) {
    return <p>השיעור לא נמצא.</p>;
  }

  return (
    <article className="learn-course">
      <Link to="/learn" className="learn-course__back">
        ← חזרה למרכז הלמידה
      </Link>

      <header className="learn-course__header">
        <p className="learn-course__eyebrow">
          {track ? `${track.title} · ` : ""}
          שיעור {topic.lesson}
        </p>
        <h1 className="learn-course__title">{topic.title}</h1>
        <p className="learn-course__summary">{topic.summary}</p>
      </header>

      {objectives && objectives.length > 0 ? (
        <section className="learn-section">
          <h2 className="learn-section__title">בסוף השיעור תדע/י</h2>
          <ul className="learn-objectives">
            {objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {children}

      <nav className="learn-nav" aria-label="ניווט בין שיעורים">
        {prev ? (
          <Link to={`/learn/${prev.slug}`}>
            <span className="learn-nav__label">השיעור הקודם</span>
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/learn/${next.slug}`} style={{ textAlign: "end" }}>
            <span className="learn-nav__label">השיעור הבא</span>
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}

export default LearnTopicLayout;
