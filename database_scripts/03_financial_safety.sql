-- Extra indexes + documentation for financial safety

CREATE INDEX IF NOT EXISTS ix_transactions_original_tx_refund
    ON transactions(original_transaction_id)
    WHERE type = 'refund';

CREATE INDEX IF NOT EXISTS ix_transactions_client_request
    ON transactions(client_request_id);

COMMENT ON COLUMN wallets.version IS
    'Optimistic locking — incremented on every balance change; used with FOR UPDATE';

COMMENT ON COLUMN transactions.client_request_id IS
    'Idempotency key — UNIQUE prevents duplicate charges on network retry';

COMMENT ON TABLE ledger_entries IS
    'Append-only audit log — UPDATE/DELETE blocked by trigger';
