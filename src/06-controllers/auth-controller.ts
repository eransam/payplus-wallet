import express, { NextFunction, Request, Response } from "express";
import authLogic from "../05-logic/auth-logic";
import { AppError } from "../01-utils/app-error";
import type { AuthenticatedRequest } from "../02-middleware/auth-middleware";

const router = express.Router();

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, full_name } = req.body as Record<string, string>;
    const result = await authLogic.register(email, password, full_name);
    res.status(201).json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as Record<string, string>;
    const result = await authLogic.login(email, password);
    res.json({
      success: true,
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("unauthorized", "Authentication required", 401);
    }
    const token = header.slice("Bearer ".length).trim();
    const payload = authLogic.verifyToken(token);
    const user = await authLogic.getUserById(payload.userId);
    if (!user) {
      throw new AppError("unauthorized", "User not found", 401);
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

export default router;
