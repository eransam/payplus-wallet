import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { Merchant } from "../models/types";
import { createMerchant } from "../services/api";

type CreateMerchantFormProps = {
  onMerchantCreated: (merchant: Merchant) => void;
};

function CreateMerchantForm({ onMerchantCreated }: CreateMerchantFormProps) {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Merchant name is required");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const merchant = await createMerchant(trimmedName);
      onMerchantCreated(merchant);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create merchant");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group className="mb-3">
        <Form.Label>Merchant name</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Coffee Shop"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={submitting}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={submitting}>
        {submitting ? "Creating..." : "Create Merchant"}
      </Button>
    </Form>
  );
}

export default CreateMerchantForm;
