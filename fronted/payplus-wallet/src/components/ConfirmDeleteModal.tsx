import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type ConfirmDeleteModalProps = {
  show: boolean;
  title: string;
  message: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDeleteModal({
  show,
  title,
  message,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          ביטול
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? "מוחק..." : "מחק"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
