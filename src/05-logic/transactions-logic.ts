import { PoolClient } from "pg";
import dal from "../04-dal/dal";
import logger from "../01-utils/log-helper";
import { AppError, badRequest, insufficientFunds, notFound } from "../01-utils/app-error";
import {
  TransactionModel,
  TransactionStatus,
  TransactionType,
} from "../03-models/wallet-domain-models";
import merchantsLogic from "./merchants-logic";
import walletsLogic from "./wallets-logic";

function mapTransaction(row: Record<string, unknown>): TransactionModel {
  return {
    id: Number(row.id),
    wallet_id: Number(row.wallet_id),
    merchant_id: Number(row.merchant_id),
    type: row.type as TransactionType,
    amount: String(row.amount),
    currency: String(row.currency),
    status: row.status as TransactionStatus,
    decline_reason: row.decline_reason ? String(row.decline_reason) : null,
    original_transaction_id: row.original_transaction_id
      ? Number(row.original_transaction_id)
      : null,
    client_request_id: String(row.client_request_id),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

function isUniqueClientRequestViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "23505"
  );
}

async function resolveIdempotentTransaction(
  clientRequestId: string
): Promise<TransactionModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, wallet_id, merchant_id, type, amount, currency, status,
            decline_reason, original_transaction_id, client_request_id, created_at, updated_at
     FROM transactions WHERE client_request_id = $1`,
    [clientRequestId]
  );
  return result.rows[0] ? mapTransaction(result.rows[0]) : null;
}

async function findByClientRequestId(
  client: PoolClient,
  clientRequestId: string
): Promise<TransactionModel | null> {
  const result = await client.query(
    `SELECT id, wallet_id, merchant_id, type, amount, currency, status,
            decline_reason, original_transaction_id, client_request_id, created_at, updated_at
     FROM transactions WHERE client_request_id = $1`,
    [clientRequestId]
  );
  return result.rows[0] ? mapTransaction(result.rows[0]) : null;
}

async function getTransactionById(id: number): Promise<TransactionModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, wallet_id, merchant_id, type, amount, currency, status,
            decline_reason, original_transaction_id, client_request_id, created_at, updated_at
     FROM transactions WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapTransaction(result.rows[0]) : null;
}

async function listTransactions(filters: {
  wallet_id?: number;
  merchant_id?: number;
  status?: TransactionStatus;
  limit?: number;
  offset?: number;
}): Promise<TransactionModel[]> {
  const pool = await dal.getPool();
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filters.wallet_id) {
    params.push(filters.wallet_id);
    conditions.push(`wallet_id = $${params.length}`);
  }
  if (filters.merchant_id) {
    params.push(filters.merchant_id);
    conditions.push(`merchant_id = $${params.length}`);
  }
  if (filters.status) {
    params.push(filters.status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(filters.limit ?? 50);
  const limitIdx = params.length;
  params.push(filters.offset ?? 0);
  const offsetIdx = params.length;

  const result = await pool.query(
    `SELECT id, wallet_id, merchant_id, type, amount, currency, status,
            decline_reason, original_transaction_id, client_request_id, created_at, updated_at
     FROM transactions ${where}
     ORDER BY id DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params
  );
  return result.rows.map(mapTransaction);
}

async function insertDeclinedTransaction(
  client: PoolClient,
  data: {
    wallet_id: number;
    merchant_id: number;
    type: TransactionType;
    amount: string;
    currency: string;
    decline_reason: string;
    original_transaction_id?: number | null;
    client_request_id: string;
  }
): Promise<TransactionModel> {
  const result = await client.query(
    `INSERT INTO transactions
       (wallet_id, merchant_id, type, amount, currency, status, decline_reason,
        original_transaction_id, client_request_id)
     VALUES ($1, $2, $3, $4, $5, 'declined', $6, $7, $8)
     RETURNING id, wallet_id, merchant_id, type, amount, currency, status,
               decline_reason, original_transaction_id, client_request_id, created_at, updated_at`,
    [
      data.wallet_id,
      data.merchant_id,
      data.type,
      data.amount,
      data.currency,
      data.decline_reason,
      data.original_transaction_id ?? null,
      data.client_request_id,
    ]
  );
  return mapTransaction(result.rows[0]);
}

async function charge(input: {
  wallet_id: number;
  merchant_id: number;
  amount: string;
  client_request_id: string;
}): Promise<TransactionModel> {
  const amount = walletsLogic.parseAmount(input.amount);
  const clientRequestId = input.client_request_id.trim();
  if (!clientRequestId) {
    throw badRequest("client_request_id is required");
  }

  const client = await dal.getClient();
  try {
    await client.query("BEGIN");

    const existing = await findByClientRequestId(client, clientRequestId);
    if (existing) {
      await client.query("COMMIT");
      return existing;
    }

    const wallet = await walletsLogic.getWalletForUpdate(client, input.wallet_id);
    if (!wallet) {
      throw notFound("Wallet", input.wallet_id);
    }

    const merchant = await merchantsLogic.getMerchantById(input.merchant_id);
    if (!merchant) {
      throw notFound("Merchant", input.merchant_id);
    }

    if (merchant.status !== "active") {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "charge",
        amount,
        currency: wallet.currency,
        decline_reason: "Merchant is inactive",
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    if (wallet.status !== "active") {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "charge",
        amount,
        currency: wallet.currency,
        decline_reason: "Wallet is inactive",
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    const balance = Number(wallet.balance);
    const chargeAmount = Number(amount);
    if (balance < chargeAmount) {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "charge",
        amount,
        currency: wallet.currency,
        decline_reason: "Insufficient funds",
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    const txResult = await client.query(
      `INSERT INTO transactions
         (wallet_id, merchant_id, type, amount, currency, status, client_request_id)
       VALUES ($1, $2, 'charge', $3, $4, 'completed', $5)
       RETURNING id, wallet_id, merchant_id, type, amount, currency, status,
                 decline_reason, original_transaction_id, client_request_id, created_at, updated_at`,
      [wallet.id, merchant.id, amount, wallet.currency, clientRequestId]
    );
    const transaction = mapTransaction(txResult.rows[0]);

    await client.query(
      `INSERT INTO ledger_entries (wallet_id, transaction_id, type, amount, currency)
       VALUES ($1, $2, 'charge', $3, $4)`,
      [wallet.id, transaction.id, amount, wallet.currency]
    );

    await client.query(
      `UPDATE wallets
       SET balance = balance - $2::numeric, version = version + 1, updated_at = NOW()
       WHERE id = $1`,
      [wallet.id, amount]
    );

    await client.query("COMMIT");
    return transaction;
  } catch (error) {
    await client.query("ROLLBACK");
    if (isUniqueClientRequestViolation(error)) {
      const existing = await resolveIdempotentTransaction(clientRequestId);
      if (existing) return existing;
    }
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("charge error:", error);
    throw error;
  } finally {
    client.release();
  }
}

async function refund(input: {
  wallet_id: number;
  merchant_id: number;
  amount: string;
  original_transaction_id: number;
  client_request_id: string;
}): Promise<TransactionModel> {
  const amount = walletsLogic.parseAmount(input.amount);
  const clientRequestId = input.client_request_id.trim();
  if (!clientRequestId) {
    throw badRequest("client_request_id is required");
  }

  const client = await dal.getClient();
  try {
    await client.query("BEGIN");

    const existing = await findByClientRequestId(client, clientRequestId);
    if (existing) {
      await client.query("COMMIT");
      return existing;
    }

    const wallet = await walletsLogic.getWalletForUpdate(client, input.wallet_id);
    if (!wallet) {
      throw notFound("Wallet", input.wallet_id);
    }

    const merchant = await merchantsLogic.getMerchantById(input.merchant_id);
    if (!merchant) {
      throw notFound("Merchant", input.merchant_id);
    }

    const originalResult = await client.query(
      `SELECT id, wallet_id, merchant_id, type, amount, currency, status
       FROM transactions WHERE id = $1 FOR UPDATE`,
      [input.original_transaction_id]
    );
    const original = originalResult.rows[0];
    if (!original) {
      throw notFound("Transaction", input.original_transaction_id);
    }

    if (original.type !== "charge" || original.status !== "completed") {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "refund",
        amount,
        currency: wallet.currency,
        decline_reason: "Original transaction is not a completed charge",
        original_transaction_id: input.original_transaction_id,
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    if (Number(original.wallet_id) !== wallet.id) {
      throw badRequest("Original transaction belongs to a different wallet");
    }

    if (merchant.status !== "active" || wallet.status !== "active") {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "refund",
        amount,
        currency: wallet.currency,
        decline_reason:
          merchant.status !== "active" ? "Merchant is inactive" : "Wallet is inactive",
        original_transaction_id: input.original_transaction_id,
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    const refundTotalResult = await client.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM transactions
       WHERE original_transaction_id = $1 AND type = 'refund' AND status = 'completed'`,
      [input.original_transaction_id]
    );
    const alreadyRefunded = Number(refundTotalResult.rows[0].total);
    const originalAmount = Number(original.amount);
    if (alreadyRefunded + Number(amount) > originalAmount) {
      const declined = await insertDeclinedTransaction(client, {
        wallet_id: wallet.id,
        merchant_id: merchant.id,
        type: "refund",
        amount,
        currency: wallet.currency,
        decline_reason: "Refund amount exceeds original charge",
        original_transaction_id: input.original_transaction_id,
        client_request_id: clientRequestId,
      });
      await client.query("COMMIT");
      return declined;
    }

    const txResult = await client.query(
      `INSERT INTO transactions
         (wallet_id, merchant_id, type, amount, currency, status,
          original_transaction_id, client_request_id)
       VALUES ($1, $2, 'refund', $3, $4, 'completed', $5, $6)
       RETURNING id, wallet_id, merchant_id, type, amount, currency, status,
                 decline_reason, original_transaction_id, client_request_id, created_at, updated_at`,
      [
        wallet.id,
        merchant.id,
        amount,
        wallet.currency,
        input.original_transaction_id,
        clientRequestId,
      ]
    );
    const transaction = mapTransaction(txResult.rows[0]);

    await client.query(
      `INSERT INTO ledger_entries (wallet_id, transaction_id, type, amount, currency)
       VALUES ($1, $2, 'refund', $3, $4)`,
      [wallet.id, transaction.id, amount, wallet.currency]
    );

    await client.query(
      `UPDATE wallets
       SET balance = balance + $2::numeric, version = version + 1, updated_at = NOW()
       WHERE id = $1`,
      [wallet.id, amount]
    );

    await client.query("COMMIT");
    return transaction;
  } catch (error) {
    await client.query("ROLLBACK");
    if (isUniqueClientRequestViolation(error)) {
      const existing = await resolveIdempotentTransaction(clientRequestId);
      if (existing) return existing;
    }
    if (error instanceof AppError) {
      throw error;
    }
    logger.error("refund error:", error);
    throw error;
  } finally {
    client.release();
  }
}

export default {
  charge,
  refund,
  getTransactionById,
  listTransactions,
};
