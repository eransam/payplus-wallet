import { NextFunction, Request, Response } from "express";
import authLogic from "../05-logic/auth-logic";
import { AppError } from "../01-utils/app-error";
import type { AuthTokenPayload } from "../03-models/auth-models";

export type AuthenticatedRequest = Request & {
  user?: AuthTokenPayload;
};

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("unauthorized", "Authentication required", 401));
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = authLogic.verifyToken(token);
    next();
  } catch (error) {
    next(error);
  }
}
