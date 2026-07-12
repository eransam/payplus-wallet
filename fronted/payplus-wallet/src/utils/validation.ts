/** בודק שסכום כספי תקין — מחזיר הודעת שגיאה או null אם תקין */
export function validateAmount(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "יש להזין סכום";
  }
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return "סכום לא תקין (לדוגמה: 30.00)";
  }
  if (Number(trimmed) <= 0) {
    return "הסכום חייב להיות גדול מ-0";
  }
  return null;
}

/** יתרה התחלתית — ריקה או סכום תקין */
export function validateOptionalAmount(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return validateAmount(trimmed);
}
