import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dal from "./04-dal/dal";
import errorsHandler from "./02-middleware/errors-handler";
import walletController from "./06-controllers/wallet-controller";
import { healthController } from "./06-controllers/health-controller";
import logger from "./01-utils/log-helper";
import config from "./01-utils/config";

const environment = process.env.NODE_ENV || "development";
const server = express();
const PORT = config.port;

server.use(cors());
server.use(helmet());
server.use(express.json({ limit: "10mb" }));
server.use(express.urlencoded({ extended: true }));

dal.connect().catch((error) => {
  logger.error("Initial DB connection failed:", error);
});

server.use("/api/health", healthController);
server.use("/api", walletController);

server.use((req: Request, _res: Response, next: NextFunction) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  const err: Error & { status?: number } = new Error("Route not found");
  err.status = 404;
  next(err);
});

server.use(errorsHandler);

server.listen(PORT, () => {
  logger.info(`PayPlus Wallet API running on port ${PORT} (${environment})`);
});
