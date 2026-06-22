# PayPlus Wallet API

Backend service for wallet & transaction processing — built with the same layered architecture as EasyBox.

## Architecture (like EasyBox)

```
src/
  01-utils/        → config, logging, AppError helpers
  02-middleware/   → errors-handler
  03-models/       → TypeScript interfaces
  04-dal/          → database connection (PostgreSQL pool)
  05-logic/        → business logic (merchants, wallets, transactions, ledger)
  06-controllers/  → Express routes
  app.ts           → entry point
database_scripts/  → SQL migrations (like EasyBox database_scripts/)
scripts/           → run-sql-scripts.ts (like EasyBox npm run run-sql)
```

| EasyBox | PayPlus Wallet |
|---------|----------------|
| SQL Server + `mssql` | PostgreSQL + `pg` |
| `upload/04-dal/dal.ts` | `04-dal/dal.ts` |
| `05-logic/*-logic.ts` | `05-logic/*-logic.ts` |
| `06-controllers/car-wash-controller.ts` | `06-controllers/wallet-controller.ts` |
| SQL Server stored procedures | `database_scripts/04_stored_procedures.sql` — Node calls `SELECT * FROM sp_*()` |

## Prerequisites

- Node.js 20+
- Docker Desktop (for local PostgreSQL)

## Quick start

```bash
# 1. Start PostgreSQL
docker compose up -d

# 2. Install dependencies
npm install

# 3. Environment
copy .env.example .env

# 4. Create tables
npm run run-sql

# 5. Run API
npm run dev
```

API: `http://localhost:3000`  
Health: `GET http://localhost:3000/api/health`  
**Swagger UI:** `http://localhost:3000/api-docs` — interactive API explorer (Try it out)

### Using Swagger UI

1. Start the API (`npm run dev`)
2. Open **http://localhost:3000/api-docs** in your browser
3. Pick an endpoint → **Try it out** → fill body → **Execute**
4. Suggested flow: **Merchants** → **Wallets** → **Transactions (charge)** → **Ledger**

Raw OpenAPI JSON: `GET http://localhost:3000/api-docs.json`

## Example flow (Postman / curl)

```bash
# Create merchant
curl -X POST http://localhost:3000/api/merchants -H "Content-Type: application/json" -d "{\"name\":\"Coffee Shop\"}"

# Create wallet with 100 ILS
curl -X POST http://localhost:3000/api/wallets -H "Content-Type: application/json" -d "{\"owner_identity\":\"employee-1\",\"currency\":\"ILS\",\"initial_balance\":\"100.00\"}"

# Charge 30 ILS
curl -X POST http://localhost:3000/api/transactions/charge -H "Content-Type: application/json" -d "{\"wallet_id\":1,\"merchant_id\":1,\"amount\":\"30.00\",\"client_request_id\":\"req-charge-001\"}"
```

## Database access

All SQL lives in **PostgreSQL stored procedures** (`database_scripts/04_stored_procedures.sql`).  
The Node.js logic layer only calls procedures — no inline queries:

```typescript
await pool.query(`SELECT * FROM sp_merchant_create($1)`, [name]);
await client.query(`SELECT * FROM sp_wallet_lock_for_update($1)`, [walletId]);
```

After pulling changes, run `npm run run-sql` to create/update procedures.

## Key design decisions

- **Money**: `NUMERIC(18,2)` in PostgreSQL, exposed as strings in API
- **Concurrency**: `SELECT ... FOR UPDATE` on wallet (and merchant) inside `BEGIN/COMMIT`
- **Optimistic locking**: `wallets.version` checked on every balance update
- **Idempotency**: unique `client_request_id` + lookup before insert + race fallback
- **Ledger**: append-only (DB trigger blocks UPDATE/DELETE); only `completed` transactions create entries
- **Refund cap**: sum of completed refunds cannot exceed original charge amount
- **DB constraints**: `CHECK (balance >= 0)`, `CHECK (amount > 0)`, status enums
- **Errors**: PayPlus structured format via `AppError` + `errors-handler`

## Financial safety guarantees

| Scenario | Protection |
|----------|------------|
| Two parallel charges on same wallet | `FOR UPDATE` row lock — second request waits, then sees updated balance |
| Network retry with same `client_request_id` | `UNIQUE(client_request_id)` + return existing transaction |
| Partial failure mid-charge | Single DB transaction — `ROLLBACK` on any error |
| Negative balance | App check + `UPDATE … WHERE balance >= amount` + `CHECK (balance >= 0)` |
| Double refund | Sum completed refunds + new amount ≤ original charge |
| Ledger tampering | Append-only trigger on `ledger_entries` |
| Merchant deactivated mid-payment | Merchant row locked with `FOR UPDATE` inside payment transaction |

### Charge flow (inside one DB transaction)

```
BEGIN
  → check idempotency (client_request_id)
  → SELECT wallet FOR UPDATE
  → SELECT merchant FOR UPDATE
  → validate balance
  → INSERT transaction (completed)
  → INSERT ledger entry
  → UPDATE wallet (balance -= amount, version++)
COMMIT
```

### Interview talking points

1. **Concurrency** — `FOR UPDATE` ensures only one request updates the wallet at a time
2. **Idempotency** — safe retries from PayPlus without double charge
3. **Immutable ledger** — audit trail; corrections are new entries, never UPDATE/DELETE
4. **Defense in depth** — validation in app + constraints in DB
5. **Refund validation** — prevents refunding more than was charged

### Manual safety tests

With the API running (`npm run dev`):

```bash
npm run test:concurrency   # 100 ILS, two parallel 80 ILS charges → one succeeds, balance 20
npm run test:idempotency   # same client_request_id twice → single charge
npm run test:double-refund # two 60 ILS refunds on 100 charge → second rejected
```

## Assumptions

- Single currency per wallet (charge must match wallet currency)
- Declined transactions are persisted without ledger movement
- Refund cannot exceed remaining refundable amount on original charge
