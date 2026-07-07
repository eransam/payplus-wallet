import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import type { HealthResponse } from "../models/types";
import { getHealth } from "../services/api";

function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHealth() {
      try {
        setLoading(true);
        setError("");
        const data = await getHealth();
        setHealth(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect to API");
      } finally {
        setLoading(false);
      }
    }

    loadHealth();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Connecting to backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Backend not reachable</Alert.Heading>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Make sure the API is running: <code>npm run dev</code> in the backend folder.</p>
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>API Health</Card.Header>
      <Card.Body>
        <p><strong>Service:</strong> {health?.service}</p>
        <p><strong>Database:</strong> {health?.database}</p>
        <p><strong>Redis:</strong> {health?.redis}</p>
        <p className="mb-0"><strong>Time:</strong> {health?.timestamp}</p>
      </Card.Body>
    </Card>
  );
}

export default HealthStatus;
