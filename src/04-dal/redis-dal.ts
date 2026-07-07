import { createClient, RedisClientType } from "redis";
import config from "../01-utils/config";
import logger from "../01-utils/log-helper";

let client: RedisClientType | null = null;
let isConnected = false;

async function connect(): Promise<void> {
  if (client?.isOpen) {
    return;
  }

  client = createClient({ url: config.redisUrl });

  client.on("error", (err) => {
    logger.error("Redis client error:", err.message);
    isConnected = false;
  });

  try {
    await client.connect();
    await client.ping();
    isConnected = true;
    logger.info("Connected to Redis");
  } catch (error: unknown) {
    isConnected = false;
    const message = error instanceof Error ? error.message : String(error);
    logger.error("Redis connection failed:", message);
    throw error;
  }
}

async function getClient(): Promise<RedisClientType> {
  if (!client?.isOpen) {
    await connect();
  }
  if (!client) {
    throw new Error("Failed to establish Redis connection");
  }
  return client;
}

function getConnectionStatus(): { isConnected: boolean; hasClient: boolean } {
  return { isConnected: isConnected && !!client?.isOpen, hasClient: !!client };
}

async function disconnect(): Promise<void> {
  if (client?.isOpen) {
    await client.quit();
  }
  client = null;
  isConnected = false;
}

export default { connect, getClient, getConnectionStatus, disconnect };
