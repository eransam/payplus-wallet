import type { HealthResponse, Merchant, Transaction, Wallet } from "../models/types";

const API_BASE = "/api";

type MerchantsResponse = {
  success: boolean;
  merchants: Merchant[];
};

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw err;
    }
    throw new Error("לא ניתן להתחבר לשרת");
  }

  let data: ApiErrorBody & T;
  try {
    data = await response.json();
  } catch {
    throw new Error("תשובה לא תקינה מהשרת");
  }

  if (!response.ok) {
    const code = data?.error?.code ?? "request_failed";
    const message = data?.error?.message ?? "הבקשה נכשלה";
    throw new ApiError(code, message);
  }

  return data as T;
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export function getMerchants(signal?: AbortSignal): Promise<Merchant[]> {
  return request<MerchantsResponse>("/merchants", { signal }).then(
    (data) => data.merchants,
  );
}

type CreateMerchantResponse = {
  success: boolean;
  merchant: Merchant;
};

export function createMerchant(name: string): Promise<Merchant> {
  return request<CreateMerchantResponse>("/merchants", {
    method: "POST",
    body: JSON.stringify({ name }),
  }).then((data) => data.merchant);
}

type WalletsResponse = {
  success: boolean;
  wallets: Wallet[];
};

export function getWallets(signal?: AbortSignal): Promise<Wallet[]> {
  return request<WalletsResponse>("/wallets", { signal }).then((data) => data.wallets);
}

type WalletByIdResponse = {
  success: boolean;
  wallet: Wallet;
  available_balance: string;
};

export function getWalletById(id: number, signal?: AbortSignal): Promise<Wallet> {
  return request<WalletByIdResponse>(`/wallets/${id}`, { signal }).then(
    (data) => data.wallet,
  );
}

type CreateWalletResponse = {
  success: boolean;
  wallet: Wallet;
};

export function createWallet(input: {
  owner_identity: string;
  currency?: string;
  initial_balance?: string;
}): Promise<Wallet> {
  return request<CreateWalletResponse>("/wallets", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((data) => data.wallet);
}

type TransactionsResponse = {
  success: boolean;
  transactions: Transaction[];
};

export function getTransactions(
  filters?: { wallet_id?: number },
  signal?: AbortSignal,
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters?.wallet_id != null) {
    params.set("wallet_id", String(filters.wallet_id));
  }
  const query = params.toString();
  const path = query ? `/transactions?${query}` : "/transactions";

  return request<TransactionsResponse>(path, { signal }).then(
    (data) => data.transactions,
  );
}

type TransactionResponse = {
  success: boolean;
  transaction: Transaction;
};

export function charge(input: {
  wallet_id: number;
  merchant_id: number;
  amount: string;
  client_request_id: string;
}): Promise<Transaction> {
  return request<TransactionResponse>("/transactions/charge", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((data) => data.transaction);
}

export function refund(input: {
  wallet_id: number;
  merchant_id: number;
  amount: string;
  original_transaction_id: number;
  client_request_id: string;
}): Promise<Transaction> {
  return request<TransactionResponse>("/transactions/refund", {
    method: "POST",
    body: JSON.stringify(input),
  }).then((data) => data.transaction);
}
