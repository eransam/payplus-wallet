/**
 * Idempotency test — same client_request_id twice → single charge.
 *
 * Usage: npm run test:idempotency
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
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log("=== Idempotency test: duplicate client_request_id ===\n");

  const merchant = await jsonPost("/merchants", { name: `Idem Merchant ${Date.now()}` });
  const wallet = await jsonPost("/wallets", {
    owner_identity: `idem-${Date.now()}`,
    currency: "ILS",
    initial_balance: "100.00",
  });

  const walletId = wallet.data.wallet?.id;
  const merchantId = merchant.data.merchant?.id;
  const requestId = `idem-key-${Date.now()}`;

  const body = {
    wallet_id: walletId,
    merchant_id: merchantId,
    amount: "30.00",
    client_request_id: requestId,
  };

  const first = await jsonPost("/transactions/charge", body);
  const second = await jsonPost("/transactions/charge", body);

  const tx1 = first.data.transaction?.id;
  const tx2 = second.data.transaction?.id;

  const walletAfter = await fetch(`${BASE}/wallets/${walletId}`).then((r) => r.json() as Promise<any>);

  console.log("First:", first.status, "tx id:", tx1);
  console.log("Second:", second.status, "tx id:", tx2);
  console.log("Balance:", walletAfter.wallet?.balance, "(expected 70.00)");

  if (tx1 === tx2 && walletAfter.wallet?.balance === "70.00") {
    console.log("\n✅ PASS — same transaction returned, charged once");
    process.exit(0);
  }

  console.log("\n❌ FAIL");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
