import { Pool, PoolClient } from "pg";
import config from "../01-utils/config";
import logger from "../01-utils/log-helper";

let pool: Pool | null = null;
let isConnected = false;

async function connect(): Promise<void> {
  if (pool) {
    return;
  }

  pool = new Pool({
    connectionString: config.databaseUrl,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  pool.on("error", (err) => {
    logger.error("PostgreSQL pool error:", err.message);
    isConnected = false;
  });

  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    isConnected = true;
    logger.info("Connected to PostgreSQL - payplus_wallet");
  } catch (error: unknown) {
    isConnected = false;
    const message = error instanceof Error ? error.message : String(error);
    logger.error("DB connection failed:", message);
    throw error;
  }
}

async function getPool(): Promise<Pool> {
  if (!pool || !isConnected) {
    await connect();
  }
  if (!pool) {
    throw new Error("Failed to establish database connection");
  }
  return pool;
}

/** Client for transactions — remember to release() */
async function getClient(): Promise<PoolClient> {
  const activePool = await getPool();
  return activePool.connect();
}

function getConnectionStatus(): { isConnected: boolean; hasPool: boolean } {
  return { isConnected, hasPool: !!pool };
}

async function disconnect(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
  isConnected = false;
}

export default { connect, getPool, getClient, getConnectionStatus, disconnect };
