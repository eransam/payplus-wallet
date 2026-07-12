// useQuery — לקריאת נתונים (GET)
// useMutation — לשינוי נתונים (POST)
// useQueryClient — גישה ל-cache (לעדכון אחרי יצירה)
// getWallets, createWallet — הפונקציות שלנו מ-api.ts (שם ה-fetch האמיתי)
// queryKeys — השם של המגירה ב-cache
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Wallet } from "../models/types";
import { createWallet, deleteWallet, getWallets, updateWallet } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

/** React Query — גישה ראשית. להשוואה עם Context ראה /learn/context ו-LEARNING.md */
export function useWallets() {
  const query = useQuery({
    queryKey: queryKeys.wallets,
    // queryFn = איך React Query מביא את הנתונים כשאין במגירה (cache).
    // אנחנו אומרים לו: "תריץ את getWallets" — שם ב-api.ts עושים fetch ל-/api/wallets.
    // signal הוא כפתור ביטול: אם המשתמש עוזב את הדף לפני שהשרת ענה,
    // React Query מבטל את הבקשה כדי שלא נעדכן מסך שכבר לא קיים.
    queryFn: ({ signal }) => getWallets(signal),
  });

// query.data — המערך שהגיע מהשרת (אחרי ש-getWallets הסתיים).
// ?? [] — אם עדיין אין נתונים (undefined), תחזיר מערך ריק. ככה wallets.map לא יקרוס.
// query.isLoading — true בזמן שהבקשה רצה. WalletsList מציג Spinner.
// query.error — אם נכשל, מתרגמים לעברית עם translateApiError.
// למה לא מחזירים את query ישירות? כדי שהקומפוננטה תישאר פשוטה — wallets, loading, error. היא לא צריכה לדעת על React Query.
  return {
    wallets: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? translateApiError(query.error, "טעינת הארנקים נכשלה")
      : "",
  };
}

// Hook נפרד ליצירת ארנק (POST). לא קריאה — כתיבה.
export function useCreateWallet() {
  const queryClient = useQueryClient();

  // useMutation — לפעולות שמשנות משהו בשרת (POST, PUT, DELETE).
  return useMutation({
    // mutationFn — מה לשלוח. מקבל את הנתונים מהטופס וקורא ל-createWallet מ-api.ts (POST ל-/api/wallets).
    mutationFn: (input: {
      owner_identity: string;
      currency?: string;
      initial_balance?: string;
    }) => createWallet(input),
    onSuccess: (wallet: Wallet) => {
      queryClient.setQueryData<Wallet[]>(queryKeys.wallets, (current = []) => [
        wallet,
        ...current,
      ]);
    },
  });
}

export function useUpdateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { owner_identity: string; status: Wallet["status"] };
    }) => updateWallet(id, data),
    onSuccess: (wallet) => {
      queryClient.setQueryData<Wallet[]>(queryKeys.wallets, (current = []) =>
        current.map((item) => (item.id === wallet.id ? wallet : item)),
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet(wallet.id) });
    },
  });
}

export function useDeleteWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteWallet(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Wallet[]>(queryKeys.wallets, (current = []) =>
        current.filter((item) => item.id !== id),
      );
      queryClient.removeQueries({ queryKey: queryKeys.wallet(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
