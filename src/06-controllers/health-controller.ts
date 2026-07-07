import express, { Request, Response } from "express";
import dal from "../04-dal/dal";
import redisDal from "../04-dal/redis-dal";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  const dbStatus = dal.getConnectionStatus();
  const redisStatus = redisDal.getConnectionStatus();
  res.json({
    success: true,
    service: "payplus-wallet",
    database: dbStatus.isConnected ? "connected" : "disconnected",
    redis: redisStatus.isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export const healthController = router;
