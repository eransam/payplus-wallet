import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../services/api";
import { translateApiError } from "../utils/apiErrors";
import { queryKeys } from "./queryKeys";

export function useHealth() {
  const query = useQuery({
    queryKey: queryKeys.health,
    queryFn: () => getHealth(),
  });

  return {
    health: query.data ?? null,
    loading: query.isLoading,
    error: query.error ? translateApiError(query.error, "החיבור לשרת נכשל") : "",
  };
}
