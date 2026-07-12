import { useState, type FormEvent } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useCreateMerchant } from "../../hooks/useMerchants";
import { translateApiError } from "../../utils/apiErrors";

/** גישת useState ידנית — ללמידה. האפליקציה הראשית משתמשת ב-react-hook-form + zod. */
function CreateMerchantFormManual() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const createMerchant = useCreateMerchant();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (createMerchant.isPending) {
      return;
    }

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("שם הסוחר הוא שדה חובה");
      return;
    }

    try {
      setError("");
      await createMerchant.mutateAsync(trimmedName);
      setName("");
    } catch (err) {
      setError(translateApiError(err, "יצירת הסוחר נכשלה"));
    }
  }

  return (
    <Form onSubmit={handleSubmit} className="mb-4" noValidate>
      <Form.Group className="mb-3">
        <Form.Label>שם הסוחר</Form.Label>
        <Form.Control
          type="text"
          placeholder='לדוגמה: "בית קפה"'
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={createMerchant.isPending}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button type="submit" variant="primary" disabled={createMerchant.isPending}>
        {createMerchant.isPending ? "יוצר..." : "צור סוחר"}
      </Button>
    </Form>
  );
}

export default CreateMerchantFormManual;
