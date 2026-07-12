import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDeleteWallet } from "../hooks/useWallets";
import type { Wallet } from "../models/types";
import { translateApiError } from "../utils/apiErrors";
import { statusLabel } from "../utils/labels";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import EditWalletModal from "./EditWalletModal";

type WalletRowProps = {
  wallet: Wallet;
};

function WalletRow({ wallet }: WalletRowProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const deleteWallet = useDeleteWallet();

  async function handleDelete() {
    try {
      setDeleteError("");
      await deleteWallet.mutateAsync(wallet.id);
      setShowDelete(false);
    } catch (err) {
      setDeleteError(translateApiError(err, "מחיקת הארנק נכשלה"));
    }
  }

  return (
    <>
      <tr>
        <td>
          <Link to={`/wallets/${wallet.id}`}>{wallet.id}</Link>
        </td>
        <td>{wallet.owner_identity}</td>
        <td>
          {wallet.balance} {wallet.currency}
        </td>
        <td>
          <Badge bg={wallet.status === "active" ? "success" : "secondary"}>
            {statusLabel(wallet.status)}
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
              aria-label={`ערוך ארנק ${wallet.id}`}
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
              aria-label={`מחק ארנק ${wallet.id}`}
            >
              🗑
            </Button>
          </div>
        </td>
      </tr>

      <EditWalletModal wallet={wallet} show={showEdit} onClose={() => setShowEdit(false)} />

      <ConfirmDeleteModal
        show={showDelete}
        title={`מחיקת ארנק #${wallet.id}`}
        message={
          deleteError ||
          `האם למחוק את הארנק של ${wallet.owner_identity}? כל העסקאות והרישומים של הארנק יימחקו גם כן.`
        }
        loading={deleteWallet.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}

export default WalletRow;
