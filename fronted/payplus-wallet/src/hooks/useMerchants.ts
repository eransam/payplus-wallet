import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Merchant } from "../models/types";
import { createMerchant, getMerchants } from "../services/api";
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
        merchant,
        ...current,
      ]);
    },
  });
}
