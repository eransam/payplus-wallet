import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { Wallet } from "../../models/types";
import { createWallet } from "../../services/api";
import { translateApiError } from "../../utils/apiErrors";
import { validateOptionalAmount } from "../../utils/validation";

type CreateWalletFormContextProps = {
  onWalletCreated: (wallet: Wallet) => void;
};

function CreateWalletFormContext({ onWalletCreated }: CreateWalletFormContextProps) {
  const [ownerIdentity, setOwnerIdentity] = useState("");
  const [currency, setCurrency] = useState("ILS");
  const [initialBalance, setInitialBalance] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const trimmedOwner = ownerIdentity.trim();
    if (!trimmedOwner) {
      setError("מזהה הבעלים הוא שדה חובה");
      return;
    }

    const balanceError = validateOptionalAmount(initialBalance);
    if (balanceError) {
      setError(balanceError);
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
      setError(translateApiError(err, "יצירת הארנק נכשלה"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4" noValidate>
      <Form.Group className="mb-3">
        <Form.Label>מזהה בעלים</Form.Label>
        <Form.Control
          type="text"
          value={ownerIdentity}
          onChange={(event) => setOwnerIdentity(event.target.value)}
          disabled={submitting}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>מטבע</Form.Label>
        <Form.Control
          type="text"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>יתרה התחלתית (אופציונלי)</Form.Label>
        <Form.Control
          type="text"
          value={initialBalance}
          onChange={(event) => setInitialBalance(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "יוצר..." : "צור ארנק"}
      </Button>
    </Form>
  );
}

export default CreateWalletFormContext;
