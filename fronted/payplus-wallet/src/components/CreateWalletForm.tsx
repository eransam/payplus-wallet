import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { Wallet } from "../models/types";
import { createWallet } from "../services/api";

type CreateWalletFormProps = {
  onWalletCreated: (wallet: Wallet) => void;
};

function CreateWalletForm({ onWalletCreated }: CreateWalletFormProps) {
  const [ownerIdentity, setOwnerIdentity] = useState("");
  const [currency, setCurrency] = useState("ILS");
  const [initialBalance, setInitialBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedOwner = ownerIdentity.trim();
    if (!trimmedOwner) {
      setError("Owner identity is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const wallet = await createWallet({
        owner_identity: trimmedOwner,
        currency: currency.trim() || "ILS",
        initial_balance: initialBalance.trim() || undefined,
      });
      onWalletCreated(wallet);
      setOwnerIdentity("");
      setInitialBalance("");
      setCurrency("ILS");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create wallet");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Owner identity</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. user@email.com"
          value={ownerIdentity}
          onChange={(event) => setOwnerIdentity(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Currency</Form.Label>
        <Form.Control
          type="text"
          placeholder="ILS"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Initial balance (optional)</Form.Label>
        <Form.Control
          type="text"
          placeholder="100.00"
          value={initialBalance}
          onChange={(event) => setInitialBalance(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Creating..." : "Create Wallet"}
      </Button>
    </Form>
  );
}

export default CreateWalletForm;
