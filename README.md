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
| Stored procedures | SQL in logic layer + DB transactions |

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

## Example flow (Postman / curl)

```bash
# Create merchant
curl -X POST http://localhost:3000/api/merchants -H "Content-Type: application/json" -d "{\"name\":\"Coffee Shop\"}"

# Create wallet with 100 ILS
curl -X POST http://localhost:3000/api/wallets -H "Content-Type: application/json" -d "{\"owner_identity\":\"employee-1\",\"currency\":\"ILS\",\"initial_balance\":\"100.00\"}"

# Charge 30 ILS
curl -X POST http://localhost:3000/api/transactions/charge -H "Content-Type: application/json" -d "{\"wallet_id\":1,\"merchant_id\":1,\"amount\":\"30.00\",\"client_request_id\":\"req-charge-001\"}"
```

## Key design decisions

- **Money**: `NUMERIC(18,2)` in PostgreSQL, exposed as strings in API
- **Concurrency**: `SELECT ... FOR UPDATE` on wallet row inside `BEGIN/COMMIT`
- **Idempotency**: unique `client_request_id` per transaction
- **Ledger**: append-only; only `completed` transactions create ledger entries
- **Errors**: PayPlus structured format via `AppError` + `errors-handler`

## Assumptions

- Single currency per wallet (charge must match wallet currency)
- Declined transactions are persisted without ledger movement
- Refund cannot exceed remaining refundable amount on original charge
