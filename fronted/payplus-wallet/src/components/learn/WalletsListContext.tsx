import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import { useWalletsContext } from "../../contexts/WalletsContext";
import CreateWalletFormContext from "./CreateWalletFormContext";
import WalletRow from "../WalletRow";

function WalletsListContext() {
  const { wallets, loading, error, addWallet } = useWalletsContext();

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>ארנקים (Context)</Card.Header>
      <Card.Body>
        <CreateWalletFormContext onWalletCreated={addWallet} />

        {wallets.length === 0 ? (
          <Alert variant="info">עדיין אין ארנקים. צור אחד למעלה.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>מזהה</th>
                <th>בעלים</th>
                <th>יתרה</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet) => (
                <WalletRow key={wallet.id} wallet={wallet} />
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}

export default WalletsListContext;
