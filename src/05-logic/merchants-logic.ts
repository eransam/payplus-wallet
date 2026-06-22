import dal from "../04-dal/dal";
import { PoolClient } from "pg";
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
  const result = await pool.query(`SELECT * FROM sp_merchant_create($1)`, [name.trim()]);
  return mapRow(result.rows[0]);
}

async function getMerchantById(id: number): Promise<MerchantModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_merchant_get_by_id($1)`, [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function lockMerchantForUpdate(
  client: PoolClient,
  id: number
): Promise<MerchantModel | null> {
  const result = await client.query(`SELECT * FROM sp_merchant_lock_for_update($1)`, [id]);
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

async function listMerchants(limit = 50, offset = 0): Promise<MerchantModel[]> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_merchant_list($1, $2)`, [limit, offset]);
  return result.rows.map(mapRow);
}

async function updateMerchantStatus(id: number, status: EntityStatus): Promise<MerchantModel> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_merchant_update_status($1, $2)`, [id, status]);
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
  lockMerchantForUpdate,
  listMerchants,
  updateMerchantStatus,
  requireActiveMerchant,
};
