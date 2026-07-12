import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Merchant } from "../models/types";
import { createMerchant, deleteMerchant, getMerchants, updateMerchant } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

/** React Query — גישה ראשית. להשוואה עם Context ראה /learn/context ו-LEARNING.md */
export function useMerchants() {  const query = useQuery({
    queryKey: queryKeys.merchants,
    queryFn: ({ signal }) => getMerchants(signal),
  });

  return {
    merchants: query.data ?? [],
    loading: query.isLoading,
    error: query.error
      ? translateApiError(query.error, "טעינת הסוחרים נכשלה")
      : "",
  };
}

export function useCreateMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createMerchant(name),
    onSuccess: (merchant: Merchant) => {
      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) => [
        { ...merchant, total_received: merchant.total_received ?? "0.00" },
        ...current,
      ]);
    },
  });
}

export function useUpdateMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; status: Merchant["status"] };
    }) => updateMerchant(id, data),
    onSuccess: (merchant) => {
      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) =>
        current.map((item) => (item.id === merchant.id ? merchant : item)),
      );
    },
  });
}

export function useDeleteMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMerchant(id),
    onSuccess: (_result, id) => {
      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) =>
        current.filter((item) => item.id !== id),
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
