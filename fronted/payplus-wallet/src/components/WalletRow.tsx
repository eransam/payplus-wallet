import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
import type { Wallet } from "../models/types";
import { statusLabel } from "../utils/labels";

type WalletRowProps = {
  wallet: Wallet;
};

function WalletRow({ wallet }: WalletRowProps) {
  return (
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
    </tr>
  );
}

export default WalletRow;
