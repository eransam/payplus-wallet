import Badge from "react-bootstrap/Badge";
import type { Transaction } from "../models/types";
import { statusLabel, transactionTypeLabel } from "../utils/labels";

type TransactionRowProps = {
  transaction: Transaction;
};

function statusBadge(status: Transaction["status"]) {
  if (status === "completed") return "success";
  if (status === "declined") return "warning";
  return "danger";
}

function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr>
      <td>{transaction.id}</td>
      <td>{transactionTypeLabel(transaction.type)}</td>
      <td>
        {transaction.amount} {transaction.currency}
      </td>
      <td>{transaction.wallet_id}</td>
      <td>{transaction.merchant_id}</td>
      <td>
        <Badge bg={statusBadge(transaction.status)}>
          {statusLabel(transaction.status)}
        </Badge>
      </td>
      <td>{transaction.original_transaction_id ?? "—"}</td>
    </tr>
  );
}

export default TransactionRow;
