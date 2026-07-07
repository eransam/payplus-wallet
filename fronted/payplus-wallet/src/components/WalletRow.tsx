import Badge from "react-bootstrap/Badge";
import type { Wallet } from "../models/types";

type WalletRowProps = {
  wallet: Wallet;
};

function WalletRow({ wallet }: WalletRowProps) {
  return (
    <tr>
      <td>{wallet.id}</td>
      <td>{wallet.owner_identity}</td>
      <td>{wallet.balance} {wallet.currency}</td>
      <td>
        <Badge bg={wallet.status === "active" ? "success" : "secondary"}>
          {wallet.status}
        </Badge>
      </td>
    </tr>
  );
}

export default WalletRow;
