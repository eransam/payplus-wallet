import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import dal from "../04-dal/dal";
import config from "../01-utils/config";
import { AppError } from "../01-utils/app-error";
import type { AuthTokenPayload, UserModel } from "../03-models/auth-models";

const SALT_ROUNDS = 10;

function mapRow(row: Record<string, unknown>): UserModel {
  return {
    id: Number(row.id),
    email: String(row.email),
    full_name: String(row.full_name),
    created_at: row.created_at as Date,
    updated_at: row.updated_at as Date,
  };
}

function signToken(user: UserModel): string {
  const payload: AuthTokenPayload = { userId: user.id, email: user.email };
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign(payload, config.jwtSecret as Secret, options);
}

function verifyToken(token: string): AuthTokenPayload {
  try {
    return jwt.verify(token, config.jwtSecret as Secret) as AuthTokenPayload;
  } catch {
    throw new AppError("unauthorized", "Invalid or expired token", 401);
  }
}

async function register(
  email: string,
  password: string,
  fullName: string,
): Promise<{ user: UserModel; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedName = fullName.trim();

  if (!normalizedEmail || !password || !trimmedName) {
    throw new AppError("validation_error", "All fields are required", 400);
  }
  if (password.length < 6) {
    throw new AppError("validation_error", "Password must be at least 6 characters", 400);
  }

  const pool = await dal.getPool();
  const existing = await pool.query(`SELECT id FROM users WHERE email = $1`, [normalizedEmail]);
  if (existing.rows[0]) {
    throw new AppError("email_exists", "Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, full_name, created_at, updated_at`,
    [normalizedEmail, passwordHash, trimmedName],
  );

  const user = mapRow(result.rows[0]);
  return { user, token: signToken(user) };
}

async function login(
  email: string,
  password: string,
): Promise<{ user: UserModel; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new AppError("validation_error", "Email and password are required", 400);
  }

  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, email, password_hash, full_name, created_at, updated_at
     FROM users WHERE email = $1`,
    [normalizedEmail],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError("invalid_credentials", "Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(password, String(row.password_hash));
  if (!valid) {
    throw new AppError("invalid_credentials", "Invalid email or password", 401);
  }

  const user = mapRow(row);
  return { user, token: signToken(user) };
}

async function getUserById(id: number): Promise<UserModel | null> {
  const pool = await dal.getPool();
  const result = await pool.query(
    `SELECT id, email, full_name, created_at, updated_at FROM users WHERE id = $1`,
    [id],
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export default { register, login, getUserById, verifyToken, signToken };
