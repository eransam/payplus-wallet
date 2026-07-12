import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateMerchant } from "../hooks/useMerchants";
import type { Merchant } from "../models/types";
import {
  editMerchantSchema,
  type EditMerchantFormValues,
} from "../schemas/entitySchemas";
import { translateApiError } from "../utils/apiErrors";
import { statusLabel } from "../utils/labels";

type EditMerchantModalProps = {
  merchant: Merchant | null;
  show: boolean;
  onClose: () => void;
};

function EditMerchantModal({ merchant, show, onClose }: EditMerchantModalProps) {
  const updateMerchant = useUpdateMerchant();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditMerchantFormValues>({
    resolver: zodResolver(editMerchantSchema),
    defaultValues: { name: "", status: "active" },
  });

  useEffect(() => {
    if (merchant) {
      reset({ name: merchant.name, status: merchant.status });
    }
  }, [merchant, reset]);

  async function onSubmit(data: EditMerchantFormValues) {
    if (!merchant || updateMerchant.isPending) {
      return;
    }

    try {
      await updateMerchant.mutateAsync({ id: merchant.id, data });
      onClose();
    } catch (err) {
      setError("root", {
        message: translateApiError(err, "עדכון הסוחר נכשל"),
      });
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>עריכת סוחר #{merchant?.id}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>שם הסוחר</Form.Label>
            <Form.Control type="text" isInvalid={!!errors.name} {...register("name")} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>סטטוס</Form.Label>
            <Form.Select isInvalid={!!errors.status} {...register("status")}>
              <option value="active">{statusLabel("active")}</option>
              <option value="inactive">{statusLabel("inactive")}</option>
            </Form.Select>
          </Form.Group>
          {errors.root && <Alert variant="danger">{errors.root.message}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={updateMerchant.isPending}>
            ביטול
          </Button>
          <Button type="submit" className="btn-eb-primary" disabled={updateMerchant.isPending}>
            {updateMerchant.isPending ? "שומר..." : "שמור"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditMerchantModal;
