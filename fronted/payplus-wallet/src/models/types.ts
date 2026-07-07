export type EntityStatus = "active" | "inactive";

export interface Merchant {
  id: number;
  name: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: number;
  owner_identity: string;
  currency: string;
  balance: string;
  status: EntityStatus;
  version: number;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "charge" | "refund";
export type TransactionStatus = "completed" | "declined" | "failed";

export interface Transaction {
  id: number;
  wallet_id: number;
  merchant_id: number;
  type: TransactionType;
  amount: string;
  currency: string;
  status: TransactionStatus;
  decline_reason: string | null;
  original_transaction_id: number | null;
  client_request_id: string;
  created_at: string;
  updated_at: string;
}

export interface HealthResponse {
  success: boolean;
  service: string;
  database: string;
  redis: string;
  timestamp: string;
}
