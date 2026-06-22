/** Structured API error — PayPlus assignment format */
export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    code: string,
    message: string,
    status: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}

export function notFound(resource: string, id: number | string): AppError {
  return new AppError("not_found", `${resource} not found`, 404, { id });
}

export function badRequest(message: string, details?: Record<string, unknown>): AppError {
  return new AppError("bad_request", message, 400, details);
}

export function insufficientFunds(
  walletId: number,
  available: string,
  requested: string
): AppError {
  return new AppError(
    "insufficient_funds",
    "Wallet does not have enough available balance",
    409,
    {
      wallet_id: walletId,
      available_balance: available,
      requested_amount: requested,
    }
  );
}
