import { useQuery } from "@tanstack/react-query";
import { getTransactions, getWalletById } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

export function useWalletDetails(walletId: number) {
  const walletQuery = useQuery({
    queryKey: queryKeys.wallet(walletId),
    queryFn: ({ signal }) => getWalletById(walletId, signal),
    enabled: walletId > 0,
  });

  const transactionsQuery = useQuery({
    queryKey: queryKeys.walletTransactions(walletId),
    queryFn: ({ signal }) => getTransactions({ wallet_id: walletId }, signal),
    enabled: walletId > 0,
  });

  const loading = walletQuery.isLoading || transactionsQuery.isLoading;
  const error = walletQuery.error ?? transactionsQuery.error;

  return {
    wallet: walletQuery.data ?? null,
    transactions: transactionsQuery.data ?? [],
    loading,
    error: error ? translateApiError(error, "טעינת הארנק נכשלה") : "",
  };
}
