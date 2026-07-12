import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useTransactions } from "../hooks/useTransactions";
import TransactionRow from "./TransactionRow";

function TransactionsList() {
  const { transactions, loading, error } = useTransactions();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>היסטוריה</Card.Header>
      <Card.Body>
        {transactions.length === 0 ? (
          <Alert variant="info">עדיין אין עסקאות. צור חיוב למעלה.</Alert>
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
  );
}

export default TransactionsList;
