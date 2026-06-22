import dal from "../04-dal/dal";
import logger from "../01-utils/log-helper";
import { AppError, notFound } from "../01-utils/app-error";
import { EntityStatus, MerchantModel } from "../03-models/wallet-domain-models";

function mapRow(row: Record<string, unknown>): MerchantModel {
  return {
    id: Number(row.id),
    name: String(row.name),
    status: row.status as EntityStatus,
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

async function createMerchant(name: string): Promise<MerchantModel> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `INSERT INTO merchants (name) VALUES ($1)
     RETURNING id, name, status, created_at, updated_at`,
    [name.trim()]
  );
  return mapRow(result.rows[0]);
}

async function getMerchantById(id: number): Promise<MerchantModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, name, status, created_at, updated_at FROM merchants WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function listMerchants(limit = 50, offset = 0): Promise<MerchantModel[]> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, name, status, created_at, updated_at
     FROM merchants ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows.map(mapRow);
}

async function updateMerchantStatus(id: number, status: EntityStatus): Promise<MerchantModel> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `UPDATE merchants SET status = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING id, name, status, created_at, updated_at`,
    [id, status]
  );
  if (!result.rows[0]) {
    throw notFound("Merchant", id);
  }
  return mapRow(result.rows[0]);
}

async function requireActiveMerchant(id: number): Promise<MerchantModel> {
  const merchant = await getMerchantById(id);
  if (!merchant) {
    throw notFound("Merchant", id);
  }
  if (merchant.status !== "active") {
    throw new AppError("merchant_inactive", "Merchant is inactive", 409, { merchant_id: id });
  }
  return merchant;
}

export default {
  createMerchant,
  getMerchantById,
  listMerchants,
  updateMerchantStatus,
  requireActiveMerchant,
};
