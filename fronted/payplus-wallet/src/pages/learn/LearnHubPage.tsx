import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import {
  getTopicsForCategory,
  learnTracks,
} from "../../data/learnTopics";

function LearnHubPage() {
  return (
    <div className="learn-hub">
      <header className="learn-hub__intro">
        <h1>מרכז הלמידה</h1>
        <p>
          שלושה מסלולים: <strong>React</strong> (פרונט),{" "}
          <strong>Node.js</strong> (בק-אנד) ו-<strong>MongoDB</strong> (מסד
          מסמכים) — על בסיס PayPlus Wallet. בתפריט הצד: למידה → מסלול → נושא →
          שיעור.
        </p>
      </header>

      {learnTracks.map((track) => (
        <section key={track.id} className="mb-5">
          <header className="mb-3">
            <h2 className="h4 mb-1">{track.title}</h2>
            <p className="text-muted mb-0">{track.summary}</p>
          </header>

          {track.categories.map((category) => {
            const topics = getTopicsForCategory(category);
            return (
              <div key={category.id} className="mb-4">
                <h3 className="h6 mb-3 text-secondary">{category.title}</h3>
                <Row className="g-3">
                  {topics.map((topic) => (
                    <Col key={topic.slug} md={6} lg={4}>
                      <div className="card learn-hub__card h-100">
                        <div className="card-body d-flex flex-column">
                          <span className="learn-hub__lesson-badge">
                            {track.title} · שיעור {topic.lesson}
                          </span>
                          <h3 className="h5 mb-2">{topic.title}</h3>
                          <p className="text-muted flex-grow-1 mb-3">
                            {topic.summary}
                          </p>
                          <Link
                            to={`/learn/${topic.slug}`}
                            className="btn btn-eb-primary btn-sm align-self-start"
                          >
                            פתח שיעור →
                          </Link>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}

export default LearnHubPage;
