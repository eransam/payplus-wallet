import { ApiError } from "../services/api";

const ERROR_MESSAGES_HE: Record<string, string> = {
  insufficient_funds: "אין מספיק יתרה בארנק",
  merchant_inactive: "הסוחר לא פעיל",
  wallet_inactive: "הארנק לא פעיל",
  refund_exceeds_charge: "סכום ההחזר עולה על סכום החיוב המקורי",
  transaction_declined: "העסקה נדחתה",
  not_found: "הפריט לא נמצא",
  invalid_credentials: "אימייל או סיסמה שגויים",
  email_exists: "האימייל כבר רשום במערכת",
  unauthorized: "יש להתחבר מחדש",
  merchant_has_transactions: "לא ניתן למחוק סוחר שיש לו עסקאות",
  wallet_has_transactions: "לא ניתן למחוק ארנק שיש לו עסקאות",
  validation_error: "נתונים לא תקינים",
};

const MESSAGE_PATTERNS_HE: [RegExp, string][] = [
  [/insufficient funds/i, "אין מספיק יתרה בארנק"],
  [/merchant is inactive/i, "הסוחר לא פעיל"],
  [/wallet is inactive/i, "הארנק לא פעיל"],
  [/refund amount exceeds/i, "סכום ההחזר עולה על סכום החיוב"],
  [/not found/i, "הפריט לא נמצא"],
  [/request failed/i, "הבקשה נכשלה"],
];

export function translateApiError(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    return ERROR_MESSAGES_HE[err.code] ?? err.message;
  }

  if (err instanceof Error) {
    for (const [pattern, hebrew] of MESSAGE_PATTERNS_HE) {
      if (pattern.test(err.message)) {
        return hebrew;
      }
    }
    return err.message;
  }

  return fallback;
}
