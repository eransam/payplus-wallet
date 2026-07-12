import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { useCreateMerchant } from "../hooks/useMerchants";
import {
  createMerchantSchema,
  type CreateMerchantFormValues,
} from "../schemas/merchantSchema";
import { translateApiError } from "../utils/apiErrors";

/** react-hook-form + zod — גישה ראשית. להשוואה עם useState ראה /learn/react-hook-form */
function CreateMerchantForm() {
  const createMerchant = useCreateMerchant();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateMerchantFormValues>({
    resolver: zodResolver(createMerchantSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(data: CreateMerchantFormValues) {
    if (createMerchant.isPending) {
      return;
    }

    try {
      await createMerchant.mutateAsync(data.name);
      reset();
    } catch (err) {
      setError("root", {
        message: translateApiError(err, "יצירת הסוחר נכשלה"),
      });
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mb-4" noValidate>
      <Form.Group className="mb-3" controlId="merchant-name">
        <Form.Label>שם הסוחר</Form.Label>
        <Form.Control
          type="text"
          placeholder='לדוגמה: "בית קפה"'
          isInvalid={!!errors.name}
          disabled={createMerchant.isPending}
          {...register("name")}
        />
        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>

      {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}

      <Button type="submit" variant="primary" disabled={createMerchant.isPending}>
        {createMerchant.isPending ? "יוצר..." : "צור סוחר"}
      </Button>
    </Form>
  );
}

export default CreateMerchantForm;
