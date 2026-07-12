import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUpdateWallet } from "../hooks/useWallets";
import type { Wallet } from "../models/types";
import { editWalletSchema, type EditWalletFormValues } from "../schemas/entitySchemas";
import { translateApiError } from "../utils/apiErrors";
import { statusLabel } from "../utils/labels";

type EditWalletModalProps = {
  wallet: Wallet | null;
  show: boolean;
  onClose: () => void;
};

function EditWalletModal({ wallet, show, onClose }: EditWalletModalProps) {
  const updateWallet = useUpdateWallet();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditWalletFormValues>({
    resolver: zodResolver(editWalletSchema),
    defaultValues: { owner_identity: "", status: "active" },
  });

  useEffect(() => {
    if (wallet) {
      reset({ owner_identity: wallet.owner_identity, status: wallet.status });
    }
  }, [wallet, reset]);

  async function onSubmit(data: EditWalletFormValues) {
    if (!wallet || updateWallet.isPending) {
      return;
    }

    try {
      await updateWallet.mutateAsync({ id: wallet.id, data });
      onClose();
    } catch (err) {
      setError("root", {
        message: translateApiError(err, "עדכון הארנק נכשל"),
      });
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>עריכת ארנק #{wallet?.id}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>מזהה בעלים</Form.Label>
            <Form.Control
              type="text"
              isInvalid={!!errors.owner_identity}
              {...register("owner_identity")}
            />
            <Form.Control.Feedback type="invalid">
              {errors.owner_identity?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>סטטוס</Form.Label>
            <Form.Select isInvalid={!!errors.status} {...register("status")}>
              <option value="active">{statusLabel("active")}</option>
              <option value="inactive">{statusLabel("inactive")}</option>
            </Form.Select>
          </Form.Group>
          {wallet && (
            <p className="text-muted small mb-0">
              יתרה נוכחית: {wallet.balance} {wallet.currency} (לא ניתן לערוך ישירות — רק דרך
              עסקאות)
            </p>
          )}
          {errors.root && <Alert variant="danger" className="mt-3 mb-0">{errors.root.message}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={updateWallet.isPending}>
            ביטול
          </Button>
          <Button type="submit" className="btn-eb-primary" disabled={updateWallet.isPending}>
            {updateWallet.isPending ? "שומר..." : "שמור"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditWalletModal;
