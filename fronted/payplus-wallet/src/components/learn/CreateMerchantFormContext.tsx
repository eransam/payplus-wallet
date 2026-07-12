import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { Merchant } from "../../models/types";
import { createMerchant } from "../../services/api";
import { translateApiError } from "../../utils/apiErrors";

type CreateMerchantFormContextProps = {
  onMerchantCreated: (merchant: Merchant) => void;
};

function CreateMerchantFormContext({
  onMerchantCreated,
}: CreateMerchantFormContextProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("שם הסוחר הוא שדה חובה");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const merchant = await createMerchant(trimmedName);
      onMerchantCreated(merchant);
      setName("");
    } catch (err) {
      setError(translateApiError(err, "יצירת הסוחר נכשלה"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>שם הסוחר</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "יוצר..." : "צור סוחר"}
      </Button>
    </Form>
  );
}

export default CreateMerchantFormContext;
