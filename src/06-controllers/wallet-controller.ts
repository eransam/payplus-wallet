import express, { NextFunction, Request, Response } from "express";
import { AppError, badRequest, insufficientFunds, notFound } from "../01-utils/app-error";
import merchantsLogic from "../05-logic/merchants-logic";
import walletsLogic from "../05-logic/wallets-logic";
import transactionsLogic from "../05-logic/transactions-logic";
import ledgerLogic from "../05-logic/ledger-logic";
import { EntityStatus, TransactionModel } from "../03-models/wallet-domain-models";

const router = express.Router();

function parseId(value: string, label: string): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest(`Invalid ${label}`, { id: value });
  }
  return id;
}

async function sendTransactionResponse(
  res: Response,
  transaction: TransactionModel,
  created = false
): Promise<void> {
  if (transaction.status === "completed") {
    res.status(created ? 201 : 200).json({ success: true, transaction });
    return;
  }

  const reason = transaction.decline_reason || "Transaction declined";
  if (reason === "Insufficient funds") {
    const wallet = await walletsLogic.getWalletById(transaction.wallet_id);
    throw insufficientFunds(
      transaction.wallet_id,
      wallet?.balance ?? "0.00",
      transaction.amount
    );
  }
  if (reason === "Merchant is inactive") {
    throw new AppError("merchant_inactive", reason, 409, { merchant_id: transaction.merchant_id });
  }
  if (reason === "Wallet is inactive") {
    throw new AppError("wallet_inactive", reason, 409, { wallet_id: transaction.wallet_id });
  }
  if (reason === "Refund amount exceeds original charge") {
    throw new AppError("refund_exceeds_charge", reason, 409, {
      transaction_id: transaction.id,
      original_transaction_id: transaction.original_transaction_id,
      requested_amount: transaction.amount,
    });
  }
  throw new AppError("transaction_declined", reason, 409, { transaction_id: transaction.id });
}

function readClientRequestId(body: Record<string, unknown>): string {
  const raw = body.client_request_id ?? body.clientRequestId;
  return String(raw || "").trim();
}

// ========== MERCHANTS ==========

router.post("/merchants", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = String(req.body?.name || "").trim();
    if (!name) {
      throw badRequest("Merchant name is required");
    }
    const merchant = await merchantsLogic.createMerchant(name);
    res.status(201).json({ success: true, merchant });
  } catch (error) {
    next(error);
  }
});

router.get("/merchants/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "merchant id");
    const merchant = await merchantsLogic.getMerchantById(id);
    if (!merchant) {
      throw notFound("Merchant", id);
    }
    res.json({ success: true, merchant });
  } catch (error) {
    next(error);
  }
});

router.get("/merchants", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;
    const merchants = await merchantsLogic.listMerchants(limit, offset);
    res.json({ success: true, merchants, limit, offset });
  } catch (error) {
    next(error);
  }
});

router.patch("/merchants/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "merchant id");
    const status = req.body?.status as EntityStatus;
    if (status !== "active" && status !== "inactive") {
      throw badRequest("status must be active or inactive");
    }
    const merchant = await merchantsLogic.updateMerchantStatus(id, status);
    res.json({ success: true, merchant });
  } catch (error) {
    next(error);
  }
});

router.patch("/merchants/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "merchant id");
    const name = String(req.body?.name || "").trim();
    const status = req.body?.status as EntityStatus;
    if (!name) {
      throw badRequest("Merchant name is required");
    }
    if (status !== "active" && status !== "inactive") {
      throw badRequest("status must be active or inactive");
    }
    const merchant = await merchantsLogic.updateMerchant(id, { name, status });
    res.json({ success: true, merchant });
  } catch (error) {
    next(error);
  }
});

router.delete("/merchants/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "merchant id");
    await merchantsLogic.deleteMerchant(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ========== WALLETS ==========

router.post("/wallets", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const owner_identity = String(req.body?.owner_identity || "").trim();
    if (!owner_identity) {
      throw badRequest("owner_identity is required");
    }
    const wallet = await walletsLogic.createWallet({
      owner_identity,
      currency: req.body?.currency,
      initial_balance: req.body?.initial_balance,
    });
    res.status(201).json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
});

router.get("/wallets/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "wallet id");
    const wallet = await walletsLogic.getWalletById(id);
    if (!wallet) {
      throw notFound("Wallet", id);
    }
    res.json({
      success: true,
      wallet,
      available_balance: wallet.balance,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/wallets", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const offset = Number(req.query.offset) || 0;
    const wallets = await walletsLogic.listWallets(limit, offset);
    res.json({ success: true, wallets, limit, offset });
  } catch (error) {
    next(error);
  }
});

router.patch("/wallets/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "wallet id");
    const status = req.body?.status as EntityStatus;
    if (status !== "active" && status !== "inactive") {
      throw badRequest("status must be active or inactive");
    }
    const wallet = await walletsLogic.updateWalletStatus(id, status);
    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
});

router.patch("/wallets/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "wallet id");
    const owner_identity = String(req.body?.owner_identity || "").trim();
    const status = req.body?.status as EntityStatus;
    if (!owner_identity) {
      throw badRequest("owner_identity is required");
    }
    if (status !== "active" && status !== "inactive") {
      throw badRequest("status must be active or inactive");
    }
    const wallet = await walletsLogic.updateWallet(id, { owner_identity, status });
    res.json({ success: true, wallet });
  } catch (error) {
    next(error);
  }
});

router.delete("/wallets/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "wallet id");
    await walletsLogic.deleteWallet(id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// ========== TRANSACTIONS ==========

router.post("/transactions/charge", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet_id = Number(req.body?.wallet_id);
    const merchant_id = Number(req.body?.merchant_id);
    const amount = String(req.body?.amount || "");
    const client_request_id = readClientRequestId(req.body);

    if (!wallet_id || !merchant_id) {
      throw badRequest("wallet_id and merchant_id are required");
    }
    if (!client_request_id) {
      throw badRequest("client_request_id is required");
    }

    const transaction = await transactionsLogic.charge({
      wallet_id,
      merchant_id,
      amount,
      client_request_id,
    });
    await sendTransactionResponse(res, transaction, true);
  } catch (error) {
    next(error);
  }
});

router.post("/transactions/refund", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wallet_id = Number(req.body?.wallet_id);
    const merchant_id = Number(req.body?.merchant_id);
    const amount = String(req.body?.amount || "");
    const original_transaction_id = Number(req.body?.original_transaction_id);
    const client_request_id = readClientRequestId(req.body);

    if (!wallet_id || !merchant_id || !original_transaction_id) {
      throw badRequest("wallet_id, merchant_id and original_transaction_id are required");
    }
    if (!client_request_id) {
      throw badRequest("client_request_id is required");
    }

    const transaction = await transactionsLogic.refund({
      wallet_id,
      merchant_id,
      amount,
      original_transaction_id,
      client_request_id,
    });
    await sendTransactionResponse(res, transaction, true);
  } catch (error) {
    next(error);
  }
});

router.get("/transactions/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "transaction id");
    const transaction = await transactionsLogic.getTransactionById(id);
    if (!transaction) {
      throw notFound("Transaction", id);
    }
    res.json({ success: true, transaction });
  } catch (error) {
    next(error);
  }
});

router.get("/transactions", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await transactionsLogic.listTransactions({
      wallet_id: req.query.wallet_id ? Number(req.query.wallet_id) : undefined,
      merchant_id: req.query.merchant_id ? Number(req.query.merchant_id) : undefined,
      status: req.query.status as TransactionModel["status"] | undefined,
      limit: Math.min(Number(req.query.limit) || 50, 100),
      offset: Number(req.query.offset) || 0,
    });
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
});

// ========== LEDGER ==========

router.get("/wallets/:id/ledger-entries", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseId(req.params.id, "wallet id");
    const wallet = await walletsLogic.getWalletById(id);
    if (!wallet) {
      throw notFound("Wallet", id);
    }
    const entries = await ledgerLogic.listByWallet(
      id,
      Math.min(Number(req.query.limit) || 100, 200),
      Number(req.query.offset) || 0
    );
    res.json({ success: true, wallet_id: id, ledger_entries: entries });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/transactions/:id/ledger-entries",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseId(req.params.id, "transaction id");
      const transaction = await transactionsLogic.getTransactionById(id);
      if (!transaction) {
        throw notFound("Transaction", id);
      }
      const entries = await ledgerLogic.listByTransaction(id);
      res.json({ success: true, transaction_id: id, ledger_entries: entries });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
