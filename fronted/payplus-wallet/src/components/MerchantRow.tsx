import Badge from "react-bootstrap/Badge";
import type { Merchant } from "../models/types";
import { statusLabel } from "../utils/labels";

type MerchantRowProps = {
  merchant: Merchant;
};

function MerchantRow({ merchant }: MerchantRowProps) {
  return (
    <tr>
      <td>{merchant.id}</td>
      <td>{merchant.name}</td>
      <td>
        <Badge bg={merchant.status === "active" ? "success" : "secondary"}>
          {statusLabel(merchant.status)}
        </Badge>
      </td>
    </tr>
  );
}

export default MerchantRow;
