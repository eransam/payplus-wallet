import type { User } from "../models/auth";
import { ApiError, request } from "./api";

const TOKEN_KEY = "payplus_token";
const USER_KEY = "payplus_user";

type AuthResponse = {
  success: boolean;
  user: User;
  token: string;
};

type MeResponse = {
  success: boolean;
  user: User;
};

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveAuth(user: User, token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function loginApi(email: string, password: string) {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  saveAuth(data.user, data.token);
  return data.user;
}

export async function registerApi(email: string, password: string, full_name: string) {
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });
  saveAuth(data.user, data.token);
  return data.user;
}

export async function fetchMe(): Promise<User> {
  const data = await request<MeResponse>("/auth/me");
  saveAuth(data.user, getStoredToken() ?? "");
  return data.user;
}

export function isUnauthorizedError(err: unknown) {
  return err instanceof ApiError && err.code === "unauthorized";
}
