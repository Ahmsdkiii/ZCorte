export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "OUT_OF_STOCK"
  | "INVALID_STATE_TRANSITION"
  | "PENDING_ORDER_LIMIT"
  | "RATE_LIMITED"
  | "PROVIDER_UNAVAILABLE"
  | "INTERNAL_ERROR";

export type ActionResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: ErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
