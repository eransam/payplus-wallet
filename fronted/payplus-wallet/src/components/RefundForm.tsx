import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import type { Transaction } from "../models/types";
import { useMerchants } from "../hooks/useMerchants";
import { useRefund, useWalletCharges } from "../hooks/useTransactions";
import { useWallets } from "../hooks/useWallets";
import { translateApiError } from "../utils/apiErrors";
import { validateAmount } from "../utils/validation";

type RefundFormProps = {
  onRefunded: (transaction: Transaction) => void;
};

function RefundForm({ onRefunded }: RefundFormProps) {
  const { wallets, loading: loadingWallets, error: walletsError } = useWallets();
  const { merchants, loading: loadingMerchants, error: merchantsError } = useMerchants();
  const refundMutation = useRefund();

  const [walletId, setWalletId] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [originalTransactionId, setOriginalTransactionId] = useState("");
  const [error, setError] = useState("");

  const {
    charges,
    loading: loadingCharges,
    error: chargesError,
  } = useWalletCharges(walletId);

  const loadingOptions = loadingWallets || loadingMerchants;
  const optionsError = walletsError || merchantsError;
  const submitting = refundMutation.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const parsedWalletId = Number(walletId);
    const parsedMerchantId = Number(merchantId);
    const parsedOriginalId = Number(originalTransactionId);
    const trimmedAmount = amount.trim();

    if (!parsedWalletId || !parsedMerchantId || !parsedOriginalId) {
      setError("יש לבחור ארנק, סוחר ועסקת חיוב");
      return;
    }

    const amountError = validateAmount(trimmedAmount);
    if (amountError) {
      setError(amountError);
      return;
    }

    try {
      setError("");
      const transaction = await refundMutation.mutateAsync({
        wallet_id: parsedWalletId,
        merchant_id: parsedMerchantId,
        amount: trimmedAmount,
        original_transaction_id: parsedOriginalId,
        client_request_id: crypto.randomUUID(),
      });
      onRefunded(transaction);
      setAmount("");
      setOriginalTransactionId("");
    } catch (err) {
      setError(translateApiError(err, "ההחזר נכשל"));
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
          onChange={(event) => {
            setWalletId(event.target.value);
            setOriginalTransactionId("");
          }}
          disabled={submitting}
          required
        >
          <option value="">בחר ארנק...</option>
          {wallets.map((wallet) => (
            <option key={wallet.id} value={wallet.id}>
              #{wallet.id} — {wallet.owner_identity}
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
        <Form.Label>עסקת חיוב מקור</Form.Label>
        <Form.Select
          value={originalTransactionId}
          onChange={(event) => setOriginalTransactionId(event.target.value)}
          disabled={submitting || !walletId || loadingCharges}
          required
        >
          <option value="">
            {!walletId
              ? "בחר קודם ארנק..."
              : loadingCharges
                ? "טוען חיובים..."
                : charges.length === 0
                  ? "אין חיובים מוצלחים"
                  : "בחר חיוב..."}
          </option>
          {charges.map((charge) => (
            <option key={charge.id} value={charge.id}>
              #{charge.id} — {charge.amount} {charge.currency}
            </option>
          ))}
        </Form.Select>
        {chargesError && <Form.Text className="text-danger">{chargesError}</Form.Text>}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>סכום</Form.Label>
        <Form.Control
          type="text"
          inputMode="decimal"
          placeholder="10.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={submitting}
          required
        />
        <Form.Text className="text-muted">פורמט: 10.00</Form.Text>
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="warning" disabled={submitting}>
        {submitting ? "מבצע החזר..." : "החזר"}
      </Button>
    </Form>
  );
}

export default RefundForm;
