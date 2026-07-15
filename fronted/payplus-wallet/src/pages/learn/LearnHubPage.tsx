import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { learnTopics } from "../../data/learnTopics";

function LearnHubPage() {
  return (
    <div className="learn-hub">
      <header className="learn-hub__intro">
        <h1>קורס React — מרכז הלמידה</h1>
        <p>
          כל שיעור בנוי כמו שיעור בקורס: מטרות למידה, הסבר מסודר, דוגמאות קוד,
          חיבור לקבצים בפרויקט, וסיכום למחברת. עבור שיעור-שיעור לפי הסדר.
        </p>
      </header>

      <Row className="g-3">
        {learnTopics.map((topic) => (
          <Col key={topic.slug} md={6} lg={4}>
            <div className="card learn-hub__card h-100">
              <div className="card-body d-flex flex-column">
                <span className="learn-hub__lesson-badge">שיעור {topic.lesson}</span>
                <h2 className="h5 mb-2">{topic.title}</h2>
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
    </div>
  );
}

export default LearnHubPage;
