import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useMerchants } from "../hooks/useMerchants";
import CreateMerchantForm from "./CreateMerchantForm";
import MerchantRow from "./MerchantRow";

function MerchantsList() {
  const { merchants, loading, error } = useMerchants();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>סוחרים</Card.Header>
      <Card.Body>
        <CreateMerchantForm />

        {merchants.length === 0 ? (
          <Alert variant="info">עדיין אין סוחרים. צור אחד למעלה.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>מזהה</th>
                <th>שם</th>
                <th>סה״כ התקבל</th>
                <th>סטטוס</th>
                <th>פעולות</th>
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
