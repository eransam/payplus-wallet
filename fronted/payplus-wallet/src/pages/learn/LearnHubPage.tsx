import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import {
  getTopicsForCategory,
  learnCategories,
} from "../../data/learnTopics";

function LearnHubPage() {
  return (
    <div className="learn-hub">
      <header className="learn-hub__intro">
        <h1>קורס React — מרכז הלמידה</h1>
        <p>
          השיעורים מחולקים לנושאים. אפשר לנווט גם מתפריט הצד (למידה → נושא →
          שיעור). עבור לפי הסדר בתוך כל קטגוריה.
        </p>
      </header>

      {learnCategories.map((category) => {
        const topics = getTopicsForCategory(category);
        return (
          <section key={category.id} className="mb-4">
            <h2 className="h5 mb-3">{category.title}</h2>
            <Row className="g-3">
              {topics.map((topic) => (
                <Col key={topic.slug} md={6} lg={4}>
                  <div className="card learn-hub__card h-100">
                    <div className="card-body d-flex flex-column">
                      <span className="learn-hub__lesson-badge">
                        שיעור {topic.lesson}
                      </span>
                      <h3 className="h5 mb-2">{topic.title}</h3>
                      <p className="text-muted flex-grow-1 mb-3">{topic.summary}</p>
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
          </section>
        );
      })}
    </div>
  );
}

export default LearnHubPage;
