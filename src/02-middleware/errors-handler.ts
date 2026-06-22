import { NextFunction, Request, Response } from "express";
import { AppError } from "../01-utils/app-error";
import config from "../01-utils/config";
import logger from "../01-utils/log-helper";

function errorsHandler(
  err: unknown,
  _request: Request,
  response: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    response.status(err.status).json(err.toJSON());
    return;
  }

  if (err instanceof Error) {
    logger.error(err.message, { stack: err.stack });

    if (err.message === "Route not found") {
      response.status(404).json({
        error: {
          code: "not_found",
          message: "Route not found",
          status: 404,
        },
      });
      return;
    }

    response.status(500).json({
      error: {
        code: "internal_error",
        message: config.isDevelopment ? err.message : "Internal server error",
        status: 500,
        ...(config.isDevelopment && err.stack ? { details: { stack: err.stack } } : {}),
      },
    });
    return;
  }

  next(err);
}

export default errorsHandler;
