-- PayPlus Wallet — stored procedures (PostgreSQL functions)
-- Called from Node.js logic layer via: SELECT * FROM sp_name($1, ...)

-- ========== MERCHANTS ==========

CREATE OR REPLACE FUNCTION sp_merchant_create(p_name VARCHAR(255))
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO merchants (name) VALUES (p_name)
    RETURNING merchants.id, merchants.name, merchants.status, merchants.created_at, merchants.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_merchant_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.name, m.status, m.created_at, m.updated_at
    FROM merchants m WHERE m.id = p_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_merchant_lock_for_update(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.name, m.status, m.created_at, m.updated_at
    FROM merchants m WHERE m.id = p_id FOR UPDATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_merchant_list(p_limit INTEGER, p_offset INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT m.id, m.name, m.status, m.created_at, m.updated_at
    FROM merchants m
    ORDER BY m.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_merchant_update_status(p_id INTEGER, p_status VARCHAR(20))
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    status VARCHAR(20),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    UPDATE merchants SET status = p_status, updated_at = NOW()
    WHERE merchants.id = p_id
    RETURNING merchants.id, merchants.name, merchants.status, merchants.created_at, merchants.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ========== WALLETS ==========

CREATE OR REPLACE FUNCTION sp_wallet_create(
    p_owner_identity VARCHAR(255),
    p_currency CHAR(3),
    p_balance NUMERIC(18, 2)
)
RETURNS TABLE (
    id INTEGER,
    owner_identity VARCHAR(255),
    currency CHAR(3),
    balance NUMERIC(18, 2),
    status VARCHAR(20),
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO wallets (owner_identity, currency, balance)
    VALUES (p_owner_identity, p_currency, p_balance)
    RETURNING wallets.id, wallets.owner_identity, wallets.currency, wallets.balance,
              wallets.status, wallets.version, wallets.created_at, wallets.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    owner_identity VARCHAR(255),
    currency CHAR(3),
    balance NUMERIC(18, 2),
    status VARCHAR(20),
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT w.id, w.owner_identity, w.currency, w.balance, w.status, w.version, w.created_at, w.updated_at
    FROM wallets w WHERE w.id = p_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_lock_for_update(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    owner_identity VARCHAR(255),
    currency CHAR(3),
    balance NUMERIC(18, 2),
    status VARCHAR(20),
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT w.id, w.owner_identity, w.currency, w.balance, w.status, w.version, w.created_at, w.updated_at
    FROM wallets w WHERE w.id = p_id FOR UPDATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_list(p_limit INTEGER, p_offset INTEGER)
RETURNS TABLE (
    id INTEGER,
    owner_identity VARCHAR(255),
    currency CHAR(3),
    balance NUMERIC(18, 2),
    status VARCHAR(20),
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT w.id, w.owner_identity, w.currency, w.balance, w.status, w.version, w.created_at, w.updated_at
    FROM wallets w
    ORDER BY w.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_update_status(p_id INTEGER, p_status VARCHAR(20))
RETURNS TABLE (
    id INTEGER,
    owner_identity VARCHAR(255),
    currency CHAR(3),
    balance NUMERIC(18, 2),
    status VARCHAR(20),
    version INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    UPDATE wallets SET status = p_status, updated_at = NOW()
    WHERE wallets.id = p_id
    RETURNING wallets.id, wallets.owner_identity, wallets.currency, wallets.balance,
              wallets.status, wallets.version, wallets.created_at, wallets.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_debit(p_id INTEGER, p_amount NUMERIC(18, 2), p_expected_version INTEGER)
RETURNS TABLE (
    balance NUMERIC(18, 2),
    version INTEGER,
    updated_rows INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH upd AS (
        UPDATE wallets
        SET balance = balance - p_amount,
            version = version + 1,
            updated_at = NOW()
        WHERE id = p_id
          AND balance >= p_amount
          AND version = p_expected_version
        RETURNING wallets.balance, wallets.version
    )
    SELECT upd.balance, upd.version, 1::INTEGER FROM upd
    UNION ALL
    SELECT NULL::NUMERIC, NULL::INTEGER, 0::INTEGER
    WHERE NOT EXISTS (SELECT 1 FROM upd)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_wallet_credit(p_id INTEGER, p_amount NUMERIC(18, 2), p_expected_version INTEGER)
RETURNS TABLE (
    balance NUMERIC(18, 2),
    version INTEGER,
    updated_rows INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH upd AS (
        UPDATE wallets
        SET balance = balance + p_amount,
            version = version + 1,
            updated_at = NOW()
        WHERE id = p_id AND version = p_expected_version
        RETURNING wallets.balance, wallets.version
    )
    SELECT upd.balance, upd.version, 1::INTEGER FROM upd
    UNION ALL
    SELECT NULL::NUMERIC, NULL::INTEGER, 0::INTEGER
    WHERE NOT EXISTS (SELECT 1 FROM upd)
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ========== TRANSACTIONS ==========

CREATE OR REPLACE FUNCTION sp_transaction_get_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.wallet_id, t.merchant_id, t.type, t.amount, t.currency, t.status,
           t.decline_reason, t.original_transaction_id, t.client_request_id, t.created_at, t.updated_at
    FROM transactions t WHERE t.id = p_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_find_by_client_request_id(p_client_request_id VARCHAR(255))
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.wallet_id, t.merchant_id, t.type, t.amount, t.currency, t.status,
           t.decline_reason, t.original_transaction_id, t.client_request_id, t.created_at, t.updated_at
    FROM transactions t WHERE t.client_request_id = p_client_request_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_lock_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.wallet_id, t.merchant_id, t.type, t.amount, t.currency, t.status
    FROM transactions t WHERE t.id = p_id FOR UPDATE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_sum_completed_refunds(p_original_transaction_id INTEGER)
RETURNS NUMERIC(18, 2) AS $$
DECLARE
    v_total NUMERIC(18, 2);
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO v_total
    FROM transactions
    WHERE original_transaction_id = p_original_transaction_id
      AND type = 'refund'
      AND status = 'completed';
    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_list(
    p_wallet_id INTEGER,
    p_merchant_id INTEGER,
    p_status VARCHAR(20),
    p_limit INTEGER,
    p_offset INTEGER
)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.wallet_id, t.merchant_id, t.type, t.amount, t.currency, t.status,
           t.decline_reason, t.original_transaction_id, t.client_request_id, t.created_at, t.updated_at
    FROM transactions t
    WHERE (p_wallet_id IS NULL OR t.wallet_id = p_wallet_id)
      AND (p_merchant_id IS NULL OR t.merchant_id = p_merchant_id)
      AND (p_status IS NULL OR t.status = p_status)
    ORDER BY t.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_insert_declined(
    p_wallet_id INTEGER,
    p_merchant_id INTEGER,
    p_type VARCHAR(20),
    p_amount NUMERIC(18, 2),
    p_currency CHAR(3),
    p_decline_reason TEXT,
    p_original_transaction_id INTEGER,
    p_client_request_id VARCHAR(255)
)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO transactions
        (wallet_id, merchant_id, type, amount, currency, status, decline_reason,
         original_transaction_id, client_request_id)
    VALUES (p_wallet_id, p_merchant_id, p_type, p_amount, p_currency, 'declined', p_decline_reason,
            p_original_transaction_id, p_client_request_id)
    RETURNING transactions.id, transactions.wallet_id, transactions.merchant_id, transactions.type,
              transactions.amount, transactions.currency, transactions.status, transactions.decline_reason,
              transactions.original_transaction_id, transactions.client_request_id,
              transactions.created_at, transactions.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_insert_completed_charge(
    p_wallet_id INTEGER,
    p_merchant_id INTEGER,
    p_amount NUMERIC(18, 2),
    p_currency CHAR(3),
    p_client_request_id VARCHAR(255)
)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO transactions
        (wallet_id, merchant_id, type, amount, currency, status, client_request_id)
    VALUES (p_wallet_id, p_merchant_id, 'charge', p_amount, p_currency, 'completed', p_client_request_id)
    RETURNING transactions.id, transactions.wallet_id, transactions.merchant_id, transactions.type,
              transactions.amount, transactions.currency, transactions.status, transactions.decline_reason,
              transactions.original_transaction_id, transactions.client_request_id,
              transactions.created_at, transactions.updated_at;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_transaction_insert_completed_refund(
    p_wallet_id INTEGER,
    p_merchant_id INTEGER,
    p_amount NUMERIC(18, 2),
    p_currency CHAR(3),
    p_original_transaction_id INTEGER,
    p_client_request_id VARCHAR(255)
)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    merchant_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    status VARCHAR(20),
    decline_reason TEXT,
    original_transaction_id INTEGER,
    client_request_id VARCHAR(255),
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO transactions
        (wallet_id, merchant_id, type, amount, currency, status,
         original_transaction_id, client_request_id)
    VALUES (p_wallet_id, p_merchant_id, 'refund', p_amount, p_currency, 'completed',
            p_original_transaction_id, p_client_request_id)
    RETURNING transactions.id, transactions.wallet_id, transactions.merchant_id, transactions.type,
              transactions.amount, transactions.currency, transactions.status, transactions.decline_reason,
              transactions.original_transaction_id, transactions.client_request_id,
              transactions.created_at, transactions.updated_at;
END;
$$ LANGUAGE plpgsql;

-- ========== LEDGER ==========

CREATE OR REPLACE FUNCTION sp_ledger_insert(
    p_wallet_id INTEGER,
    p_transaction_id INTEGER,
    p_type VARCHAR(20),
    p_amount NUMERIC(18, 2),
    p_currency CHAR(3)
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO ledger_entries (wallet_id, transaction_id, type, amount, currency)
    VALUES (p_wallet_id, p_transaction_id, p_type, p_amount, p_currency);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_ledger_list_by_wallet(
    p_wallet_id INTEGER,
    p_limit INTEGER,
    p_offset INTEGER
)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    transaction_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT le.id, le.wallet_id, le.transaction_id, le.type, le.amount, le.currency, le.created_at
    FROM ledger_entries le
    WHERE le.wallet_id = p_wallet_id
    ORDER BY le.id DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_ledger_list_by_transaction(p_transaction_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    wallet_id INTEGER,
    transaction_id INTEGER,
    type VARCHAR(20),
    amount NUMERIC(18, 2),
    currency CHAR(3),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT le.id, le.wallet_id, le.transaction_id, le.type, le.amount, le.currency, le.created_at
    FROM ledger_entries le
    WHERE le.transaction_id = p_transaction_id
    ORDER BY le.id ASC;
END;
$$ LANGUAGE plpgsql;
