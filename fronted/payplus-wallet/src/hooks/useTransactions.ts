import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "../models/types";
import { charge, getTransactions, refund } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

export function useTransactions() {
  const query = useQuery({
    queryKey: queryKeys.transactions,
    queryFn: ({ signal }) => getTransactions(undefined, signal),
  });

  return {
    transactions: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? translateApiError(query.error, "טעינת העסקאות נכשלה")
      : "",
  };
}

export function useWalletCharges(walletId: string) {
  const numericId = Number(walletId);

  const query = useQuery({
    queryKey: queryKeys.walletCharges(numericId),
    queryFn: ({ signal }) => getTransactions({ wallet_id: numericId }, signal),
    enabled: numericId > 0,
    select: (transactions) =>
      transactions.filter(
        (transaction) =>
          transaction.type === "charge" && transaction.status === "completed",
      ),
  });

  return {
    charges: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? translateApiError(query.error, "טעינת החיובים נכשלה")
      : "",
  };
}

function invalidateAfterMoneyChange(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
  queryClient.invalidateQueries({ queryKey: queryKeys.wallets });
  queryClient.invalidateQueries({ queryKey: queryKeys.merchants });
}

export function useCharge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: charge,
    onSuccess: () => invalidateAfterMoneyChange(queryClient),
  });
}

export function useRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: refund,
    onSuccess: (_transaction, variables) => {
      invalidateAfterMoneyChange(queryClient);
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletCharges(variables.wallet_id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.walletTransactions(variables.wallet_id),
      });
    },
  });
}

export type { Transaction };
