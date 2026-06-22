/** OpenAPI 3.0 — PayPlus Wallet API */
const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "PayPlus Wallet API",
    version: "1.0.0",
    description:
      "Wallet & transaction processing API — merchants, wallets, charges, refunds, and ledger.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local development" }],
  tags: [
    { name: "Health", description: "Service health" },
    { name: "Merchants", description: "Merchant management" },
    { name: "Wallets", description: "Wallet management" },
    { name: "Transactions", description: "Charge and refund" },
    { name: "Ledger", description: "Audit ledger entries" },
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: { type: "string", example: "insufficient_funds" },
              message: { type: "string" },
              status: { type: "integer", example: 409 },
              details: { type: "object", additionalProperties: true },
            },
          },
        },
      },
      Merchant: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          status: { type: "string", enum: ["active", "inactive"] },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Wallet: {
        type: "object",
        properties: {
          id: { type: "integer" },
          owner_identity: { type: "string" },
          currency: { type: "string", example: "ILS" },
          balance: { type: "string", example: "100.00" },
          status: { type: "string", enum: ["active", "inactive"] },
          version: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      Transaction: {
        type: "object",
        properties: {
          id: { type: "integer" },
          wallet_id: { type: "integer" },
          merchant_id: { type: "integer" },
          type: { type: "string", enum: ["charge", "refund"] },
          amount: { type: "string", example: "30.00" },
          currency: { type: "string", example: "ILS" },
          status: { type: "string", enum: ["completed", "declined", "failed"] },
          decline_reason: { type: "string", nullable: true },
          original_transaction_id: { type: "integer", nullable: true },
          client_request_id: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      LedgerEntry: {
        type: "object",
        properties: {
          id: { type: "integer" },
          wallet_id: { type: "integer" },
          transaction_id: { type: "integer" },
          type: { type: "string", enum: ["charge", "refund"] },
          amount: { type: "string" },
          currency: { type: "string" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      CreateMerchant: {
        type: "object",
        required: ["name"],
        properties: { name: { type: "string", example: "Coffee Shop" } },
      },
      UpdateStatus: {
        type: "object",
        required: ["status"],
        properties: { status: { type: "string", enum: ["active", "inactive"] } },
      },
      CreateWallet: {
        type: "object",
        required: ["owner_identity"],
        properties: {
          owner_identity: { type: "string", example: "employee-1" },
          currency: { type: "string", example: "ILS", default: "ILS" },
          initial_balance: { type: "string", example: "100.00", default: "0.00" },
        },
      },
      ChargeRequest: {
        type: "object",
        required: ["wallet_id", "merchant_id", "amount", "client_request_id"],
        properties: {
          wallet_id: { type: "integer", example: 1 },
          merchant_id: { type: "integer", example: 1 },
          amount: { type: "string", example: "30.00" },
          client_request_id: { type: "string", example: "req-charge-001" },
        },
      },
      RefundRequest: {
        type: "object",
        required: [
          "wallet_id",
          "merchant_id",
          "amount",
          "original_transaction_id",
          "client_request_id",
        ],
        properties: {
          wallet_id: { type: "integer", example: 1 },
          merchant_id: { type: "integer", example: 1 },
          amount: { type: "string", example: "10.00" },
          original_transaction_id: { type: "integer", example: 1 },
          client_request_id: { type: "string", example: "req-refund-001" },
        },
      },
    },
  },
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service and database status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    service: { type: "string" },
                    database: { type: "string", enum: ["connected", "disconnected"] },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/merchants": {
      post: {
        tags: ["Merchants"],
        summary: "Create merchant",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateMerchant" } } },
        },
        responses: {
          "201": {
            description: "Merchant created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    merchant: { $ref: "#/components/schemas/Merchant" },
                  },
                },
              },
            },
          },
          "400": { description: "Bad request", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      get: {
        tags: ["Merchants"],
        summary: "List merchants",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: {
          "200": {
            description: "Merchant list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    merchants: { type: "array", items: { $ref: "#/components/schemas/Merchant" } },
                    limit: { type: "integer" },
                    offset: { type: "integer" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/merchants/{id}": {
      get: {
        tags: ["Merchants"],
        summary: "Get merchant by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Merchant found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    merchant: { $ref: "#/components/schemas/Merchant" },
                  },
                },
              },
            },
          },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/api/merchants/{id}/status": {
      patch: {
        tags: ["Merchants"],
        summary: "Activate or inactivate merchant",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateStatus" } } },
        },
        responses: {
          "200": {
            description: "Status updated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    merchant: { $ref: "#/components/schemas/Merchant" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/wallets": {
      post: {
        tags: ["Wallets"],
        summary: "Create wallet",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateWallet" } } },
        },
        responses: {
          "201": {
            description: "Wallet created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    wallet: { $ref: "#/components/schemas/Wallet" },
                  },
                },
              },
            },
          },
        },
      },
      get: {
        tags: ["Wallets"],
        summary: "List wallets",
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: { "200": { description: "Wallet list" } },
      },
    },
    "/api/wallets/{id}": {
      get: {
        tags: ["Wallets"],
        summary: "Get wallet by id (includes available balance)",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Wallet found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    wallet: { $ref: "#/components/schemas/Wallet" },
                    available_balance: { type: "string" },
                  },
                },
              },
            },
          },
          "404": { description: "Not found" },
        },
      },
    },
    "/api/wallets/{id}/status": {
      patch: {
        tags: ["Wallets"],
        summary: "Activate or inactivate wallet",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateStatus" } } },
        },
        responses: { "200": { description: "Status updated" } },
      },
    },
    "/api/transactions/charge": {
      post: {
        tags: ["Transactions"],
        summary: "Create charge transaction",
        description:
          "Idempotent via `client_request_id`. Uses row locking (`FOR UPDATE`) for concurrency safety.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ChargeRequest" } } },
        },
        responses: {
          "201": {
            description: "Charge completed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    transaction: { $ref: "#/components/schemas/Transaction" },
                  },
                },
              },
            },
          },
          "409": {
            description: "Insufficient funds or declined",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } },
          },
        },
      },
    },
    "/api/transactions/refund": {
      post: {
        tags: ["Transactions"],
        summary: "Create refund transaction",
        description: "Refund total cannot exceed original charge amount.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefundRequest" } } },
        },
        responses: {
          "201": { description: "Refund completed" },
          "409": { description: "Refund exceeds charge or declined" },
        },
      },
    },
    "/api/transactions/{id}": {
      get: {
        tags: ["Transactions"],
        summary: "Get transaction by id",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Transaction found" }, "404": { description: "Not found" } },
      },
    },
    "/api/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "List transactions",
        parameters: [
          { name: "wallet_id", in: "query", schema: { type: "integer" } },
          { name: "merchant_id", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["completed", "declined", "failed"] } },
          { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: { "200": { description: "Transaction list" } },
      },
    },
    "/api/wallets/{id}/ledger-entries": {
      get: {
        tags: ["Ledger"],
        summary: "List ledger entries for a wallet",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer", default: 100 } },
          { name: "offset", in: "query", schema: { type: "integer", default: 0 } },
        ],
        responses: { "200": { description: "Ledger entries" } },
      },
    },
    "/api/transactions/{id}/ledger-entries": {
      get: {
        tags: ["Ledger"],
        summary: "List ledger entries for a transaction",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: { "200": { description: "Ledger entries" } },
      },
    },
  },
};

export default swaggerSpec;
