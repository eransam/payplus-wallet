import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { learnTopics } from "../../data/learnTopics";

function LearnHubPage() {
  return (
    <div>
      <h1 className="mb-2">מרכז למידה — React</h1>
      <p className="text-muted mb-4">
        כל נושא שלמדנו בפרויקט — הסבר, קבצים רלוונטיים, וקישור לדמו בפעולה.
      </p>

      <Row className="g-3">
        {learnTopics.map((topic) => (
          <Col key={topic.slug} md={6} lg={4}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Subtitle className="text-muted mb-2">
                  שיעור {topic.lesson}
                </Card.Subtitle>
                <Card.Title>{topic.title}</Card.Title>
                <Card.Text className="flex-grow-1">{topic.summary}</Card.Text>
                <Link
                  to={`/learn/${topic.slug}`}
                  className="btn btn-primary btn-sm align-self-start"
                >
                  למד את הנושא →
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default LearnHubPage;
