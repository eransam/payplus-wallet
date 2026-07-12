import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ChargeForm from "../components/ChargeForm";
import RefundForm from "../components/RefundForm";
import TransactionsList from "../components/TransactionsList";
import type { Transaction } from "../models/types";
import { statusLabel, transactionTypeLabel } from "../utils/labels";

function TransactionsPage() {
  const [lastResult, setLastResult] = useState<Transaction | null>(null);

  function handleSuccess(transaction: Transaction) {
    setLastResult(transaction);
  }

  return (
    <div>
      <h1 className="mb-4">עסקאות</h1>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>חיוב</Card.Title>
              <Card.Text className="text-muted">
                חיוב ארנק. בחר ארנק וסוחר מהרשימה.
              </Card.Text>
              <ChargeForm onCharged={handleSuccess} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>החזר</Card.Title>
              <Card.Text className="text-muted">
                החזר על חיוב שהושלם. בחר ארנק ואז את עסקת החיוב.
              </Card.Text>
              <RefundForm onRefunded={handleSuccess} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {lastResult && (
        <Alert
          variant={lastResult.status === "completed" ? "success" : "warning"}
          className="mb-4"
        >
          <strong>
            {transactionTypeLabel(lastResult.type)} #{lastResult.id}
          </strong>{" "}
          — {statusLabel(lastResult.status)}, סכום {lastResult.amount}{" "}
          {lastResult.currency}
          {lastResult.decline_reason ? ` (${lastResult.decline_reason})` : ""}
        </Alert>
      )}

      <TransactionsList />
    </div>
  );
}

export default TransactionsPage;
