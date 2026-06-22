/**
 * Double-refund test — refund 60 twice on 100 charge → second rejected.
 *
 * Usage: npm run test:double-refund
 */
import dotenv from "dotenv";
dotenv.config();

const BASE = `http://localhost:${process.env.PORT || 3000}/api`;

async function jsonPost(path: string, body: unknown): Promise<{ status: number; data: any }> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function main() {
  console.log("=== Double-refund test: 100 charge, two 60 refunds ===\n");

  const merchant = await jsonPost("/merchants", { name: `Refund Merchant ${Date.now()}` });
  const wallet = await jsonPost("/wallets", {
    owner_identity: `refund-${Date.now()}`,
    currency: "ILS",
    initial_balance: "100.00",
  });

  const walletId = wallet.data.wallet?.id;
  const merchantId = merchant.data.merchant?.id;

  const charge = await jsonPost("/transactions/charge", {
    wallet_id: walletId,
    merchant_id: merchantId,
    amount: "100.00",
    client_request_id: `charge-${Date.now()}`,
  });
  const chargeId = charge.data.transaction?.id;
  if (!chargeId) throw new Error("Charge failed");

  const refund1 = await jsonPost("/transactions/refund", {
    wallet_id: walletId,
    merchant_id: merchantId,
    amount: "60.00",
    original_transaction_id: chargeId,
    client_request_id: `refund-1-${Date.now()}`,
  });

  const refund2 = await jsonPost("/transactions/refund", {
    wallet_id: walletId,
    merchant_id: merchantId,
    amount: "60.00",
    original_transaction_id: chargeId,
    client_request_id: `refund-2-${Date.now()}`,
  });

  const walletAfter = await fetch(`${BASE}/wallets/${walletId}`).then((r) => r.json() as Promise<any>);

  console.log("Refund 1:", refund1.status);
  console.log("Refund 2:", refund2.status, refund2.data?.error?.code || "ok");
  console.log("Balance:", walletAfter.wallet?.balance, "(expected 60.00)");

  const r1Ok = refund1.status === 201;
  const r2Rejected = refund2.status === 409 && refund2.data?.error?.code === "refund_exceeds_charge";
  const balanceOk = walletAfter.wallet?.balance === "60.00";

  if (r1Ok && r2Rejected && balanceOk) {
    console.log("\n✅ PASS — second refund rejected, balance 60.00");
    process.exit(0);
  }

  console.log("\n❌ FAIL");
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
