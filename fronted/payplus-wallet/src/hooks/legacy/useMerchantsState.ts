import { useEffect, useState } from "react";
import type { Merchant } from "../../models/types";
import { getMerchants } from "../../services/api";
import { translateApiError } from "../../utils/apiErrors";

export type MerchantsState = {
  merchants: Merchant[];
  loading: boolean;
  error: string;
  addMerchant: (merchant: Merchant) => void;
};

/** גישת Context + useEffect — ללמידה. האפליקציה הראשית משתמשת ב-React Query. */
export function useMerchantsState(): MerchantsState {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMerchants() {
      try {
        setLoading(true);
        setError("");
        const data = await getMerchants(controller.signal);
        setMerchants(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(translateApiError(err, "טעינת הסוחרים נכשלה"));
      } finally {
        setLoading(false);
      }
    }

    loadMerchants();
    return () => controller.abort();
  }, []);

  function addMerchant(merchant: Merchant) {
    setMerchants((current) => [merchant, ...current]);
  }

  return { merchants, loading, error, addMerchant };
}
