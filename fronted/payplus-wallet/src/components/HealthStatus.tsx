import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import { useHealth } from "../hooks/useHealth";

function HealthStatus() {
  const { health, loading, error } = useHealth();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">מתחבר לשרת...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>השרת לא זמין</Alert.Heading>
        <p>{error}</p>
        <hr />
        <p className="mb-0">
          ודא שה-API רץ: <code>npm run dev</code> בתיקיית הבקאנד.
        </p>
      </Alert>
    );
  }

  return (
    <Card className="eb-card">
      <Card.Header>סטטוס API</Card.Header>
      <Card.Body>
        <p>
          <strong>שירות:</strong> {health?.service}
        </p>
        <p>
          <strong>מסד נתונים:</strong> {health?.database}
        </p>
        <p>
          <strong>Redis:</strong> {health?.redis}
        </p>
        <p className="mb-0">
          <strong>זמן:</strong> {health?.timestamp}
        </p>
      </Card.Body>
    </Card>
  );
}

export default HealthStatus;
