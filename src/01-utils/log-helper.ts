import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";
import { LOGS_DIR } from "./logging-config";

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: path.join(LOGS_DIR, "error.log"), level: "error" }),
    new transports.File({ filename: path.join(LOGS_DIR, "combined.log") }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;
