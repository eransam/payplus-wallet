import { PoolClient } from "pg";
import { AppError } from "../01-utils/app-error";
import { WalletModel } from "../03-models/wallet-domain-models";

function mapWalletRow(row: Record<string, unknown>): WalletModel {
  return {
    id: Number(row.id),
    owner_identity: String(row.owner_identity),
    currency: String(row.currency),
    balance: String(row.balance),
    status: row.status as WalletModel["status"],
    version: Number(row.version),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

/** Row lock via sp_wallet_lock_for_update */
export async function lockWallet(
  client: PoolClient,
  walletId: number
): Promise<WalletModel | null> {
  const result = await client.query(`SELECT * FROM sp_wallet_lock_for_update($1)`, [walletId]);
  return result.rows[0] ? mapWalletRow(result.rows[0]) : null;
}

export async function debitWallet(
  client: PoolClient,
  walletId: number,
  amount: string,
  expectedVersion: number
): Promise<{ balance: string; version: number }> {
  const result = await client.query(`SELECT * FROM sp_wallet_debit($1, $2, $3)`, [
    walletId,
    amount,
    expectedVersion,
  ]);
  const row = result.rows[0];
  if (!row || Number(row.updated_rows) !== 1) {
    throw new AppError(
      "concurrent_wallet_update",
      "Wallet balance changed during charge — request declined",
      409,
      { wallet_id: walletId, amount }
    );
  }
  return { balance: String(row.balance), version: Number(row.version) };
}

export async function creditWallet(
  client: PoolClient,
  walletId: number,
  amount: string,
  expectedVersion: number
): Promise<{ balance: string; version: number }> {
  const result = await client.query(`SELECT * FROM sp_wallet_credit($1, $2, $3)`, [
    walletId,
    amount,
    expectedVersion,
  ]);
  const row = result.rows[0];
  if (!row || Number(row.updated_rows) !== 1) {
    throw new AppError(
      "concurrent_wallet_update",
      "Wallet changed during refund — request declined",
      409,
      { wallet_id: walletId, amount }
    );
  }
  return { balance: String(row.balance), version: Number(row.version) };
}

export async function sumCompletedRefunds(
  client: PoolClient,
  originalTransactionId: number
): Promise<number> {
  const result = await client.query(`SELECT sp_transaction_sum_completed_refunds($1) AS total`, [
    originalTransactionId,
  ]);
  return Number(result.rows[0].total);
}
