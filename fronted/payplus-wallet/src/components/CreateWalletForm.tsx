import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useCreateWallet } from "../hooks/useWallets";
import { translateApiError } from "../utils/apiErrors";
import { validateOptionalAmount } from "../utils/validation";

function CreateWalletForm() {
  const [ownerIdentity, setOwnerIdentity] = useState("");
  const [currency, setCurrency] = useState("ILS");
  const [initialBalance, setInitialBalance] = useState("");
  const [error, setError] = useState("");
  const createWallet = useCreateWallet();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createWallet.isPending) {
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
      setError("");
      await createWallet.mutateAsync({
        owner_identity: trimmedOwner,
        currency: currency.trim() || "ILS",
        initial_balance: initialBalance.trim() || undefined,
      });
      setOwnerIdentity("");
      setInitialBalance("");
      setCurrency("ILS");
    } catch (err) {
      setError(translateApiError(err, "יצירת הארנק נכשלה"));
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4" noValidate>
      <Form.Group className="mb-3">
        <Form.Label>מזהה בעלים</Form.Label>
        <Form.Control
          type="text"
          placeholder="לדוגמה: user@email.com"
          value={ownerIdentity}
          onChange={(event) => setOwnerIdentity(event.target.value)}
          disabled={createWallet.isPending}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>מטבע</Form.Label>
        <Form.Control
          type="text"
          placeholder="ILS"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          disabled={createWallet.isPending}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>יתרה התחלתית (אופציונלי)</Form.Label>
        <Form.Control
          type="text"
          inputMode="decimal"
          placeholder="100.00"
          value={initialBalance}
          onChange={(event) => setInitialBalance(event.target.value)}
          disabled={createWallet.isPending}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={createWallet.isPending}>
        {createWallet.isPending ? "יוצר..." : "צור ארנק"}
      </Button>
    </Form>
  );
}

export default CreateWalletForm;
