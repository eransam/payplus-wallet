import { createContext, useContext, type ReactNode } from "react";
import {
  useWalletsState,
  type WalletsState,
} from "../hooks/legacy/useWalletsState";

const WalletsContext = createContext<WalletsState | null>(null);

type WalletsProviderProps = {
  children: ReactNode;
};

export function WalletsProvider({ children }: WalletsProviderProps) {
  const value = useWalletsState();

  return (
    <WalletsContext.Provider value={value}>{children}</WalletsContext.Provider>
  );
}

/** קורא נתונים מה-Context — רק בתוך WalletsProvider */
export function useWalletsContext() {
  const context = useContext(WalletsContext);
  if (!context) {
    throw new Error("useWalletsContext חייב לרוץ בתוך WalletsProvider");
  }
  return context;
}
