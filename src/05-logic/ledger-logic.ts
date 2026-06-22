import dal from "../04-dal/dal";
import { LedgerEntryModel } from "../03-models/wallet-domain-models";

function mapRow(row: Record<string, unknown>): LedgerEntryModel {
  return {
    id: Number(row.id),
    wallet_id: Number(row.wallet_id),
    transaction_id: Number(row.transaction_id),
    type: row.type as LedgerEntryModel["type"],
    amount: String(row.amount),
    currency: String(row.currency),
    created_at: row.created_at as Date,
  };
}

async function listByWallet(walletId: number, limit = 100, offset = 0): Promise<LedgerEntryModel[]> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_ledger_list_by_wallet($1, $2, $3)`, [
    walletId,
    limit,
    offset,
  ]);
  return result.rows.map(mapRow);
}

async function listByTransaction(transactionId: number): Promise<LedgerEntryModel[]> {
  const pool = await dal.getPool();
  const result = await pool.query(`SELECT * FROM sp_ledger_list_by_transaction($1)`, [transactionId]);
  return result.rows.map(mapRow);
}

export default { listByWallet, listByTransaction };
