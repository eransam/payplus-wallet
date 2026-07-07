import redisDal from "../04-dal/redis-dal";
import logger from "../01-utils/log-helper";
import { TransactionModel } from "../03-models/wallet-domain-models";

const KEY_PREFIX = "idempotency:";
const TTL_SECONDS = 60 * 60 * 24; // 24 hours

// בונה מפתח עבור הקשר של הטרנזקציה
function buildKey(clientRequestId: string): string {
  return `${KEY_PREFIX}${clientRequestId}`;
}

async function get(clientRequestId: string): Promise<TransactionModel | null> {
  try {
    const redis = await redisDal.getClient();
    const raw = await redis.get(buildKey(clientRequestId));
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as TransactionModel;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("Idempotency cache read failed:", message);
    return null;
  }
}

async function set(clientRequestId: string, transaction: TransactionModel): Promise<void> {
  try {
    const redis = await redisDal.getClient();
    await redis.set(buildKey(clientRequestId), JSON.stringify(transaction), {
      EX: TTL_SECONDS,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.warn("Idempotency cache write failed:", message);
  }
}

export default { get, set };
