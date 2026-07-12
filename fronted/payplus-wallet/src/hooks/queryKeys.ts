export const queryKeys = {
  health: ["health"] as const,
  merchants: ["merchants"] as const,
  wallets: ["wallets"] as const,
  wallet: (id: number) => ["wallets", id] as const,
  transactions: ["transactions"] as const,
  walletTransactions: (walletId: number) => ["transactions", { walletId }] as const,
  walletCharges: (walletId: number) => ["transactions", "charges", walletId] as const,
};
