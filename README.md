# PayPlus Wallet API

Backend service for wallet & transaction processing (PayPlus Senior Backend Assignment).

**Stack:** Node.js · TypeScript · Express · PostgreSQL · Docker

---

## Prerequisites

- **Node.js** 20+
- **Docker Desktop** (must be running — provides PostgreSQL)

---

## Environment variables

Create a `.env` file in the project root (not committed to git):

```
PORT=3000
DATABASE_URL=postgresql://payplus:payplus@localhost:5432/payplus_wallet
```

---

## How to run

### First time setup

```bash
# 1. Start PostgreSQL (runs in background via Docker)
docker compose up -d

# 2. Install dependencies
npm install

# 3. Create .env file in project root with:
#    PORT=3000
#    DATABASE_URL=postgresql://payplus:payplus@localhost:5432/payplus_wallet

# 4. Create tables, triggers, and stored procedures
npm run run-sql

# 5. Start the API server
npm run dev
```

### Every time after that

```bash
docker compose up -d    # start DB if not already running
npm run dev             # start API (keep this terminal open)
```

> **Note:** Docker = database only. `npm run dev` = API server. Both are required.

### Verify it works

| Check | URL |
|-------|-----|
| Health | http://localhost:3000/api/health → `"database": "connected"` |
| Swagger UI | http://localhost:3000/api-docs |

---

## Test the API (Swagger — recommended)

1. Open **http://localhost:3000/api-docs**
2. Run in order:
   - `POST /api/merchants` → create merchant, note `merchant.id`
   - `POST /api/wallets` → create wallet with `"initial_balance": "100.00"`, note `wallet.id`
   - `POST /api/transactions/charge` → use those ids + unique `client_request_id`
   - `GET /api/wallets/{id}/ledger-entries` → see audit log

### Example charge body

```json
{
  "wallet_id": 1,
  "merchant_id": 1,
  "amount": "30.00",
  "client_request_id": "req-charge-001"
}
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/merchants` | Create merchant |
| GET | `/api/merchants` | List merchants |
| GET | `/api/merchants/:id` | Get merchant |
| PATCH | `/api/merchants/:id/status` | Activate / inactivate |
| POST | `/api/wallets` | Create wallet |
| GET | `/api/wallets` | List wallets |
| GET | `/api/wallets/:id` | Get wallet + balance |
| PATCH | `/api/wallets/:id/status` | Activate / inactivate |
| POST | `/api/transactions/charge` | Charge wallet |
| POST | `/api/transactions/refund` | Refund a charge |
| GET | `/api/transactions/:id` | Get transaction |
| GET | `/api/transactions` | List transactions (optional filters) |
| GET | `/api/wallets/:id/ledger-entries` | Ledger for wallet |
| GET | `/api/transactions/:id/ledger-entries` | Ledger for transaction |

**Error format** (assignment requirement):

```json
{
  "error": {
    "code": "insufficient_funds",
    "message": "Wallet does not have enough available balance",
    "status": 409,
    "details": { "wallet_id": 1, "available_balance": "20.00", "requested_amount": "80.00" }
  }
}
```

---

## Automated safety tests

With the API running (`npm run dev`), in a **second terminal**:

```bash
npm run test:concurrency    # two parallel 80 ILS charges on 100 ILS wallet → one succeeds
npm run test:idempotency    # duplicate client_request_id → single charge
npm run test:double-refund  # refund total cannot exceed original charge
```

---

## Architecture

```
src/
  01-utils/        config, logging, AppError, Swagger
  02-middleware/   errors-handler
  03-models/       TypeScript interfaces
  04-dal/          PostgreSQL connection pool (pg)
  05-logic/        business logic — calls stored procedures only
  06-controllers/  Express routes
  app.ts           entry point

database_scripts/
  01_create_wallet_tables.sql
  02_ledger_append_only.sql
  03_financial_safety.sql
  04_stored_procedures.sql    ← all SQL lives here
```

**Database access:** Node.js does not contain inline SQL. All queries run via PostgreSQL stored procedures (`sp_*`), called as:

```typescript
await pool.query(`SELECT * FROM sp_merchant_create($1)`, [name]);
```

Re-run `npm run run-sql` after pulling DB script changes.

---

## Key design decisions

| Topic | Approach |
|-------|----------|
| Money | `NUMERIC(18,2)` in DB, strings in API |
| Concurrency | `FOR UPDATE` row lock on wallet + merchant inside `BEGIN/COMMIT` |
| Idempotency | `UNIQUE(client_request_id)` + return existing transaction on retry |
| Optimistic lock | `wallets.version` checked on every balance update |
| Ledger | Append-only (trigger blocks UPDATE/DELETE); only `completed` txs |
| Refunds | Sum of completed refunds ≤ original charge amount |
| DB constraints | `CHECK (balance >= 0)`, `CHECK (amount > 0)`, status enums |

### Charge flow (single DB transaction)

```
BEGIN
  → check idempotency (client_request_id)
  → lock wallet + merchant (FOR UPDATE)
  → validate balance / status
  → insert transaction + ledger entry
  → debit wallet (version++)
COMMIT
```

---

## Assumptions

- Single currency per wallet; charge uses wallet currency
- `client_request_id` is required on charge and refund
- Declined transactions are saved but do not create ledger entries
- Inactive merchant or wallet → transaction declined, no balance change
- Refund must reference a completed charge on the same wallet

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `database: disconnected` | Run `docker compose up -d`, then `npm run run-sql` |
| `EADDRINUSE` port 3000 | Stop other process on port 3000, or change `PORT` in `.env` |
| `function sp_* does not exist` | Run `npm run run-sql` |
| Docker not running | Open Docker Desktop, wait for "Engine running" |

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start API with hot reload |
| `npm start` | Start API (production) |
| `npm run run-sql` | Apply all `database_scripts/*.sql` |
| `npm run typecheck` | TypeScript compile check |
| `npm run test:concurrency` | Concurrency test script |
| `npm run test:idempotency` | Idempotency test script |
| `npm run test:double-refund` | Double-refund test script |
