import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useMerchantsContext } from "../../contexts/MerchantsContext";
import CreateMerchantFormContext from "./CreateMerchantFormContext";
import MerchantRow from "../MerchantRow";

function MerchantsListContext() {
  const { merchants, loading, error, addMerchant } = useMerchantsContext();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>סוחרים (Context)</Card.Header>
      <Card.Body>
        <CreateMerchantFormContext onMerchantCreated={addMerchant} />

        {merchants.length === 0 ? (
          <Alert variant="info">עדיין אין סוחרים. צור אחד למעלה.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>מזהה</th>
                <th>שם</th>
                <th>סטטוס</th>
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

export default MerchantsListContext;
