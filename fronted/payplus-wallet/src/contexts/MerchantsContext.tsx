import { createContext, useContext, type ReactNode } from "react";
import {
  useMerchantsState,
  type MerchantsState,
} from "../hooks/legacy/useMerchantsState";

const MerchantsContext = createContext<MerchantsState | null>(null);

type MerchantsProviderProps = {
  children: ReactNode;
};

export function MerchantsProvider({ children }: MerchantsProviderProps) {
  const value = useMerchantsState();

  return (
    <MerchantsContext.Provider value={value}>{children}</MerchantsContext.Provider>
  );
}

/** קורא נתונים מה-Context — רק בתוך MerchantsProvider */
export function useMerchantsContext() {
  const context = useContext(MerchantsContext);
  if (!context) {
    throw new Error("useMerchantsContext חייב לרוץ בתוך MerchantsProvider");
  }
  return context;
}
