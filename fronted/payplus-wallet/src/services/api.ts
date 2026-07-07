import type { HealthResponse, Merchant, Wallet } from "../models/types";

const API_BASE = "/api";

type MerchantsResponse = {
  success: boolean;
  merchants: Merchant[];
};


async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Request failed");
  }

  return data as T;
}

export function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}


export function getMerchants(): Promise<Merchant[]> {
  return request<MerchantsResponse>("/merchants").then((data) => data.merchants);
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

export function getWallets(): Promise<Wallet[]> {
  return request<WalletsResponse>("/wallets").then((data) => data.wallets);
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
