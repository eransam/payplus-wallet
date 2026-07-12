import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import type { Merchant } from "../models/types";
import { useDeleteMerchant } from "../hooks/useMerchants";
import { translateApiError } from "../utils/apiErrors";
import { statusLabel } from "../utils/labels";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditMerchantModal from "./EditMerchantModal";

type MerchantRowProps = {
  merchant: Merchant;
};

function MerchantRow({ merchant }: MerchantRowProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deleteMerchant = useDeleteMerchant();

  async function handleDelete() {
    try {
      setDeleteError("");
      await deleteMerchant.mutateAsync(merchant.id);
      setShowDelete(false);
    } catch (err) {
      setDeleteError(translateApiError(err, "מחיקת הסוחר נכשלה"));
    }
  }

  return (
    <>
      <tr>
        <td>{merchant.id}</td>
        <td>{merchant.name}</td>
        <td>{merchant.total_received} ILS</td>
        <td>
          <Badge bg={merchant.status === "active" ? "success" : "secondary"}>
            {statusLabel(merchant.status)}
          </Badge>
        </td>
        <td>
          <div className="row-actions">
            <Button
              type="button"
              variant="outline-secondary"
              size="sm"
              className="row-actions__btn"
              onClick={() => setShowEdit(true)}
              title="עריכה"
              aria-label={`ערוך סוחר ${merchant.name}`}
            >
              ✎
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              size="sm"
              className="row-actions__btn"
              onClick={() => {
                setDeleteError("");
                setShowDelete(true);
              }}
              title="מחיקה"
              aria-label={`מחק סוחר ${merchant.name}`}
            >
              🗑
            </Button>
          </div>
        </td>
      </tr>

      <EditMerchantModal
        merchant={merchant}
        show={showEdit}
        onClose={() => setShowEdit(false)}
      />

      <ConfirmDeleteModal
        show={showDelete}
        title={`מחיקת סוחר #${merchant.id}`}
        message={
          deleteError ||
          `האם למחוק את "${merchant.name}"? כל העסקאות של הסוחר יימחקו גם כן.`
        }
        loading={deleteMerchant.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}

export default MerchantRow;
