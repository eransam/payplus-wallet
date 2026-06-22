export type EntityStatus = "active" | "inactive";

export interface MerchantModel {
  id: number;
  name: string;
  status: EntityStatus;
  created_at: Date;
  updated_at: Date;
}

export interface WalletModel {
  id: number;
  owner_identity: string;
  currency: string;
  balance: string;
  status: EntityStatus;
  version: number;
  created_at: Date;
  updated_at: Date;
}

export type TransactionType = "charge" | "refund";
export type TransactionStatus = "completed" | "declined" | "failed";

export interface TransactionModel {
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
  created_at: Date;
  updated_at: Date;
}

export type LedgerEntryType = "charge" | "refund";

export interface LedgerEntryModel {
  id: number;
  wallet_id: number;
  transaction_id: number;
  type: LedgerEntryType;
  amount: string;
  currency: string;
  created_at: Date;
}
