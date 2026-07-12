import { useEffect, useState } from "react";
import type { Wallet } from "../../models/types";
import { getWallets } from "../../services/api";
import { translateApiError } from "../../utils/apiErrors";

export type WalletsState = {
  wallets: Wallet[];
  loading: boolean;
  error: string;
  addWallet: (wallet: Wallet) => void;
};

/** גישת Context + useEffect — ללמידה. האפליקציה הראשית משתמשת ב-React Query. */
export function useWalletsState(): WalletsState {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadWallets() {
      try {
        setLoading(true);
        setError("");
        const data = await getWallets(controller.signal);
        setWallets(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(translateApiError(err, "טעינת הארנקים נכשלה"));
      } finally {
        setLoading(false);
      }
    }

    loadWallets();
    return () => controller.abort();
  }, []);

  function addWallet(wallet: Wallet) {
    setWallets((current) => [wallet, ...current]);
  }

  return { wallets, loading, error, addWallet };
}
