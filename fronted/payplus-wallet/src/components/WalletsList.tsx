import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import type { Wallet } from "../models/types";
import { getWallets } from "../services/api";
import CreateWalletForm from "./CreateWalletForm";
import WalletRow from "./WalletRow";

function WalletsList() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadWallets() {
      try {
        setLoading(true);
        setError("");
        const data = await getWallets();
        setWallets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wallets");
      } finally {
        setLoading(false);
      }
    }

    loadWallets();
  }, []);

  function handleWalletCreated(wallet: Wallet) {
    setWallets((current) => [wallet, ...current]);
  }

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card>
      <Card.Header>Wallets</Card.Header>
      <Card.Body>
        <CreateWalletForm onWalletCreated={handleWalletCreated} />

        {wallets.length === 0 ? (
          <Alert variant="info">No wallets yet. Create one above.</Alert>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Owner</th>
                <th>Balance</th>
                <th>Status</th>
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

export default WalletsList;
