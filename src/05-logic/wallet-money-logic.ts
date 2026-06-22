import { PoolClient } from "pg";
import { AppError } from "../01-utils/app-error";
import { WalletModel } from "../03-models/wallet-domain-models";

/** Row lock — prevents concurrent charges from reading stale balance */
export async function lockWallet(
  client: PoolClient,
  walletId: number
): Promise<WalletModel | null> {
  const result = await client.query(
    `SELECT id, owner_identity, currency, balance, status, version, created_at, updated_at
     FROM wallets WHERE id = $1 FOR UPDATE`,
    [walletId]
  );
  if (!result.rows[0]) return null;
  const row = result.rows[0];
  return {
    id: Number(row.id),
    owner_identity: String(row.owner_identity),
    currency: String(row.currency),
    balance: String(row.balance),
    status: row.status,
    version: Number(row.version),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Debit with defense-in-depth:
 * - wallet row already locked (FOR UPDATE)
 * - UPDATE only if balance >= amount AND version matches (optimistic lock)
 * - DB CHECK (balance >= 0) is last line of defense
 */
export async function debitWallet(
  client: PoolClient,
  walletId: number,
  amount: string,
  expectedVersion: number
): Promise<{ balance: string; version: number }> {
  const result = await client.query(
    `UPDATE wallets
     SET balance = balance - $2::numeric,
         version = version + 1,
         updated_at = NOW()
     WHERE id = $1
       AND balance >= $2::numeric
       AND version = $3
     RETURNING balance, version`,
    [walletId, amount, expectedVersion]
  );

  if (!result.rowCount) {
    throw new AppError(
      "concurrent_wallet_update",
      "Wallet balance changed during charge — request declined",
      409,
      { wallet_id: walletId, amount }
    );
  }

  return {
    balance: String(result.rows[0].balance),
    version: Number(result.rows[0].version),
  };
}

/** Credit wallet after refund — version must match locked row */
export async function creditWallet(
  client: PoolClient,
  walletId: number,
  amount: string,
  expectedVersion: number
): Promise<{ balance: string; version: number }> {
  const result = await client.query(
    `UPDATE wallets
     SET balance = balance + $2::numeric,
         version = version + 1,
         updated_at = NOW()
     WHERE id = $1 AND version = $2
     RETURNING balance, version`,
    [walletId, amount, expectedVersion]
  );

  if (!result.rowCount) {
    throw new AppError(
      "concurrent_wallet_update",
      "Wallet changed during refund — request declined",
      409,
      { wallet_id: walletId, amount }
    );
  }

  return {
    balance: String(result.rows[0].balance),
    version: Number(result.rows[0].version),
  };
}

/** Sum of completed refunds against a charge — call inside same DB transaction */
export async function sumCompletedRefunds(
  client: PoolClient,
  originalTransactionId: number
): Promise<number> {
  const result = await client.query(
    `SELECT COALESCE(SUM(amount), 0) AS total
     FROM transactions
     WHERE original_transaction_id = $1
       AND type = 'refund'
       AND status = 'completed'`,
    [originalTransactionId]
  );
  return Number(result.rows[0].total);
}
