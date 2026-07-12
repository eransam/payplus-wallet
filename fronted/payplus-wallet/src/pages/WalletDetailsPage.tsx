import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { Link, useParams } from "react-router-dom";
import TransactionRow from "../components/TransactionRow";
import { useWalletDetails } from "../hooks/useWalletDetails";
import { statusLabel } from "../utils/labels";

function WalletDetailsPage() {
  const { id } = useParams();
  const walletId = Number(id);
  const { wallet, transactions, loading, error } = useWalletDetails(walletId);

  if (!walletId) {
    return <Alert variant="danger">מזהה ארנק לא תקין</Alert>;
  }

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return (
      <div>
        <Alert variant="danger">{error}</Alert>
        <Link to="/wallets" className="btn btn-secondary">
          חזרה לארנקים
        </Link>
      </div>
    );
  }

  if (!wallet) {
    return <Alert variant="warning">הארנק לא נמצא</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">ארנק #{wallet.id}</h1>
        <Link to="/wallets" className="btn btn-outline-secondary">
          חזרה לארנקים
        </Link>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <p className="mb-1">
            <strong>בעלים:</strong> {wallet.owner_identity}
          </p>
          <p className="mb-1">
            <strong>יתרה:</strong> {wallet.balance} {wallet.currency}
          </p>
          <p className="mb-0">
            <strong>סטטוס:</strong>{" "}
            <Badge bg={wallet.status === "active" ? "success" : "secondary"}>
              {statusLabel(wallet.status)}
            </Badge>
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>עסקאות של הארנק</Card.Header>
        <Card.Body>
          {transactions.length === 0 ? (
            <Alert variant="info">עדיין אין עסקאות לארנק זה.</Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>מזהה</th>
                  <th>סוג</th>
                  <th>סכום</th>
                  <th>ארנק</th>
                  <th>סוחר</th>
                  <th>סטטוס</th>
                  <th>מקור</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default WalletDetailsPage;
