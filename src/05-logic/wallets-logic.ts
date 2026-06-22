import dal from "../04-dal/dal";
import { AppError, badRequest, notFound } from "../01-utils/app-error";
import { EntityStatus, WalletModel } from "../03-models/wallet-domain-models";
import { PoolClient } from "pg";

function mapRow(row: Record<string, unknown>): WalletModel {
  return {
    id: Number(row.id),
    owner_identity: String(row.owner_identity),
    currency: String(row.currency),
    balance: String(row.balance),
    status: row.status as EntityStatus,
    version: Number(row.version),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

function parseAmount(value: string): string {
  const normalized = value.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    throw badRequest("Invalid amount format", { amount: value });
  }
  const num = Number(normalized);
  if (!Number.isFinite(num) || num <= 0) {
    throw badRequest("Amount must be positive", { amount: value });
  }
  return num.toFixed(2);
}

async function createWallet(data: {
  owner_identity: string;
  currency?: string;
  initial_balance?: string;
}): Promise<WalletModel> {
  const currency = (data.currency || "ILS").toUpperCase();
  const balance = data.initial_balance ? parseAmount(data.initial_balance) : "0.00";

  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_wallet_create($1, $2, $3)`, [
    data.owner_identity.trim(),
    currency,
    balance,
  ]);
  return mapRow(result.rows[0]);
}

async function getWalletById(id: number): Promise<WalletModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_wallet_get_by_id($1)`, [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function listWallets(limit = 50, offset = 0): Promise<WalletModel[]> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_wallet_list($1, $2)`, [limit, offset]);
  return result.rows.map(mapRow);
}

async function updateWalletStatus(id: number, status: EntityStatus): Promise<WalletModel> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_wallet_update_status($1, $2)`, [id, status]);
  if (!result.rows[0]) {
    throw notFound("Wallet", id);
  }
  return mapRow(result.rows[0]);
}

async function getWalletForUpdate(client: PoolClient, id: number): Promise<WalletModel | null> {
  const result = await client.query(`SELECT * FROM sp_wallet_lock_for_update($1)`, [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

function assertWalletActive(wallet: WalletModel): void {
  if (wallet.status !== "active") {
    throw new AppError("wallet_inactive", "Wallet is inactive", 409, { wallet_id: wallet.id });
  }
}

export default {
  createWallet,
  getWalletById,
  listWallets,
  updateWalletStatus,
  getWalletForUpdate,
  assertWalletActive,
  parseAmount,
};
