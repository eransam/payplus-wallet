import type { EntityStatus, TransactionStatus, TransactionType } from "../models/types";

export function statusLabel(status: EntityStatus | TransactionStatus): string {
  const labels: Record<string, string> = {
    active: "פעיל",
    inactive: "לא פעיל",
    completed: "הושלם",
    declined: "נדחה",
    failed: "נכשל",
  };
  return labels[status] ?? status;
}

export function transactionTypeLabel(type: TransactionType): string {
  return type === "charge" ? "חיוב" : "החזר";
}
