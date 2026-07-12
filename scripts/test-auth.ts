/**
 * Shared auth helper for API test scripts.
 * Registers a throwaway user and returns a Bearer token.
 */
import dotenv from "dotenv";

dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 3001}/api`;

export async function getTestAuthToken(): Promise<string> {
  const email = `test-${Date.now()}@payplus.local`;
  const password = "test1234";
  const full_name = "Test User";

  const registerRes = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, full_name }),
  });

  if (registerRes.ok) {
    const data = await registerRes.json();
    return data.token as string;
  }

  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!loginRes.ok) {
    throw new Error("Failed to obtain test auth token");
  }

  const data = await loginRes.json();
  return data.token as string;
}

export function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export { BASE };
