import express, { Request, Response } from "express";
import dal from "../04-dal/dal";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  const dbStatus = dal.getConnectionStatus();
  res.json({
    success: true,
    service: "payplus-wallet",
    database: dbStatus.isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export const healthController = router;
