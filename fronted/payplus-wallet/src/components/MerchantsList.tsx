import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import type { Merchant } from "../models/types";
import { getMerchants } from "../services/api";
import CreateMerchantForm from "./CreateMerchantForm";
import MerchantRow from "./MerchantRow";

function MerchantsList() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMerchants() {
      try {
        setLoading(true);
        setError("");
        const data = await getMerchants();
        setMerchants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load merchants");
      } finally {
        setLoading(false);
      }
    }

    loadMerchants();
  }, []);

  function handleMerchantCreated(merchant: Merchant) {
    setMerchants((current) => [merchant, ...current]);
  }

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>Merchants</Card.Header>
      <Card.Body>
        <CreateMerchantForm onMerchantCreated={handleMerchantCreated} />

        {merchants.length === 0 ? (
          <Alert variant="info">No merchants yet. Create one above.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {merchants.map((merchant) => (
                <MerchantRow key={merchant.id} merchant={merchant} />
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default MerchantsList;
