-- PayPlus Wallet — initial schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS merchants (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallets (
    id              SERIAL PRIMARY KEY,
    owner_identity  VARCHAR(255) NOT NULL,
    currency        CHAR(3) NOT NULL DEFAULT 'ILS',
    balance         NUMERIC(18, 2) NOT NULL DEFAULT 0
                    CHECK (balance >= 0),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'inactive')),
    version         INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
    id                      SERIAL PRIMARY KEY,
    wallet_id               INTEGER NOT NULL REFERENCES wallets(id),
    merchant_id             INTEGER NOT NULL REFERENCES merchants(id),
    type                    VARCHAR(20) NOT NULL CHECK (type IN ('charge', 'refund')),
    amount                  NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    currency                CHAR(3) NOT NULL,
    status                  VARCHAR(20) NOT NULL
                            CHECK (status IN ('completed', 'declined', 'failed')),
    decline_reason          TEXT,
    original_transaction_id INTEGER REFERENCES transactions(id),
    client_request_id       VARCHAR(255) NOT NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_transactions_client_request UNIQUE (client_request_id)
);

CREATE TABLE IF NOT EXISTS ledger_entries (
    id              SERIAL PRIMARY KEY,
    wallet_id       INTEGER NOT NULL REFERENCES wallets(id),
    transaction_id  INTEGER NOT NULL REFERENCES transactions(id),
    type            VARCHAR(20) NOT NULL CHECK (type IN ('charge', 'refund')),
    amount          NUMERIC(18, 2) NOT NULL CHECK (amount > 0),
    currency        CHAR(3) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_ledger_transaction UNIQUE (transaction_id)
);

CREATE INDEX IF NOT EXISTS ix_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS ix_transactions_merchant_id ON transactions(merchant_id);
CREATE INDEX IF NOT EXISTS ix_ledger_entries_wallet_id ON ledger_entries(wallet_id);
