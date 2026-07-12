import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import type { Transaction } from "../models/types";
import { useMerchants } from "../hooks/useMerchants";
import { useCharge } from "../hooks/useTransactions";
import { useWallets } from "../hooks/useWallets";
import { translateApiError } from "../utils/apiErrors";
import { validateAmount } from "../utils/validation";

type ChargeFormProps = {
  onCharged: (transaction: Transaction) => void;
};

function ChargeForm({ onCharged }: ChargeFormProps) {
  const { wallets, loading: loadingWallets, error: walletsError } = useWallets();
  const { merchants, loading: loadingMerchants, error: merchantsError } = useMerchants();
  const chargeMutation = useCharge();

  const [walletId, setWalletId] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const loadingOptions = loadingWallets || loadingMerchants;
  const optionsError = walletsError || merchantsError;
  const submitting = chargeMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const parsedWalletId = Number(walletId);
    const parsedMerchantId = Number(merchantId);
    const trimmedAmount = amount.trim();

    if (!parsedWalletId || !parsedMerchantId) {
      setError("יש לבחור ארנק וסוחר");
      return;
    }

    const amountError = validateAmount(trimmedAmount);
    if (amountError) {
      setError(amountError);
      return;
    }

    try {
      setError("");
      const transaction = await chargeMutation.mutateAsync({
        wallet_id: parsedWalletId,
        merchant_id: parsedMerchantId,
        amount: trimmedAmount,
        client_request_id: crypto.randomUUID(),
      });
      onCharged(transaction);
      setAmount("");
    } catch (err) {
      setError(translateApiError(err, "החיוב נכשל"));
    }
  }

  if (loadingOptions) {
    return <Spinner animation="border" role="status" size="sm" />;
  }

  if (optionsError) {
    return <Alert variant="danger">{optionsError}</Alert>;
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Form.Group className="mb-3">
        <Form.Label>ארנק</Form.Label>
        <Form.Select
          value={walletId}
          onChange={(event) => setWalletId(event.target.value)}
          disabled={submitting}
          required
        >
          <option value="">בחר ארנק...</option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              #{wallet.id} — {wallet.owner_identity} ({wallet.balance} {wallet.currency})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>סוחר</Form.Label>
        <Form.Select
          value={merchantId}
          onChange={(event) => setMerchantId(event.target.value)}
          disabled={submitting}
          required
        >
          <option value="">בחר סוחר...</option>
          {merchants.map((merchant) => (
            <option key={merchant.id} value={merchant.id}>
              #{merchant.id} — {merchant.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>סכום</Form.Label>
        <Form.Control
          type="text"
          inputMode="decimal"
          placeholder="30.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting}
          required
        />
        <Form.Text className="text-muted">פורמט: 30.00</Form.Text>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "מחייב..." : "חייב"}
      </Button>
    </Form>
  );
}

export default ChargeForm;
