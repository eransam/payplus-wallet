import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Merchant } from "../models/types";
import { createMerchant, deleteMerchant, getMerchants, updateMerchant } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

/** React Query — גישה ראשית. להשוואה עם Context ראה /learn/context */
export function useMerchants() {
  const query = useQuery({
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

/**
 * יצירה אופטימיסטית: מוסיפים סוחר זמני לרשימה מיד,
 * ואם השרת נכשל — מחזירים את הרשימה הקודמת.
 */
export function useCreateMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createMerchant(name),

    onMutate: async (name) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.merchants });

      const previous = queryClient.getQueryData<Merchant[]>(queryKeys.merchants);
      const now = new Date().toISOString();
      const optimistic: Merchant = {
        id: -Date.now(),
        name: name.trim(),
        status: "active",
        total_received: "0.00",
        created_at: now,
        updated_at: now,
      };

      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) => [
        optimistic,
        ...current,
      ]);

      return { previous, optimisticId: optimistic.id };
    },

    onError: (_error, _name, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.merchants, context.previous);
      }
    },

    onSuccess: (merchant, _name, context) => {
      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) => {
        const withoutOptimistic = current.filter(
          (item) => item.id !== context?.optimisticId,
        );
        return [
          { ...merchant, total_received: merchant.total_received ?? "0.00" },
          ...withoutOptimistic,
        ];
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants });
    },
  });
}

/** עדכון אופטימיסטי: משנים את השורה מיד, rollback אם נכשל */
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

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.merchants });
      const previous = queryClient.getQueryData<Merchant[]>(queryKeys.merchants);

      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) =>
        current.map((item) =>
          item.id === id
            ? { ...item, ...data, updated_at: new Date().toISOString() }
            : item,
        ),
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.merchants, context.previous);
      }
    },

    onSuccess: (merchant) => {
      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) =>
        current.map((item) => (item.id === merchant.id ? merchant : item)),
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants });
    },
  });
}

/** מחיקה אופטימיסטית: השורה נעלמת מיד, חוזרת אם השרת נכשל */
export function useDeleteMerchant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMerchant(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.merchants });
      const previous = queryClient.getQueryData<Merchant[]>(queryKeys.merchants);

      queryClient.setQueryData<Merchant[]>(queryKeys.merchants, (current = []) =>
        current.filter((item) => item.id !== id),
      );

      return { previous };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.merchants, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.merchants });
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
    },
  });
}
