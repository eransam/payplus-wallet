/**
 * Manual concurrency test — assignment scenario:
 * Wallet 100 ILS, two parallel charges of 80 ILS → only one succeeds.
 *
 * Usage: npm run test:concurrency
 * (API must be running on PORT from .env)
 */
import dotenv from "dotenv";
dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 3001}/api`;

async function jsonPost(path: string, body: unknown): Promise<{ status: number; data: any }> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  console.log("=== Concurrency test: 100 ILS, two charges of 80 ILS ===\n");

  const merchant = await jsonPost("/merchants", { name: `Test Merchant ${Date.now()}` });
  const merchantId = merchant.data.merchant?.id;
  if (!merchantId) throw new Error("Failed to create merchant");

  const wallet = await jsonPost("/wallets", {
    owner_identity: `concurrency-test-${Date.now()}`,
    currency: "ILS",
    initial_balance: "100.00",
  });
  const walletId = wallet.data.wallet?.id;
  if (!walletId) throw new Error("Failed to create wallet");

  console.log(`Merchant #${merchantId}, Wallet #${walletId} balance 100.00\n`);

  const chargeBody = {
    wallet_id: walletId,
    merchant_id: merchantId,
    amount: "80.00",
  };

  const [a, b] = await Promise.all([
    jsonPost("/transactions/charge", {
      ...chargeBody,
      client_request_id: `concurrent-a-${Date.now()}`,
    }),
    jsonPost("/transactions/charge", {
      ...chargeBody,
      client_request_id: `concurrent-b-${Date.now()}`,
    }),
  ]);

  console.log("Request A:", a.status, JSON.stringify(a.data, null, 2));
  console.log("\nRequest B:", b.status, JSON.stringify(b.data, null, 2));

  const walletAfter = await fetch(`${BASE}/wallets/${walletId}`).then((r) => r.json() as Promise<any>);
  const balance = walletAfter.wallet?.balance;
  console.log(`\nFinal balance: ${balance} (expected: 20.00)`);

  const aOk = a.status === 201;
  const bOk = b.status === 201;
  const oneSuccess = (aOk && !bOk) || (!aOk && bOk);
  const balanceOk = balance === "20.00";

  if (oneSuccess && balanceOk) {
    console.log("\n✅ PASS — exactly one charge succeeded, balance is 20.00");
    process.exit(0);
  }

  console.log("\n❌ FAIL — check output above");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
