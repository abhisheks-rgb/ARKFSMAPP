/**
 * AppError — typed domain error.
 * path: src/domain/errors/AppError.ts
 */
export type ErrorCode =
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'TOKEN_EXPIRED'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode?: number,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static network(msg = 'Network error')        { return new AppError('NETWORK_ERROR',    msg); }
  static unauthorized(msg = 'Unauthorized')    { return new AppError('UNAUTHORIZED',     msg, 401); }
  static tokenExpired()                        { return new AppError('TOKEN_EXPIRED',    'Session expired. Please log in again.', 401); }
  static notFound(r: string)                   { return new AppError('NOT_FOUND',        `${r} not found`, 404); }
  static validation(msg: string)               { return new AppError('VALIDATION_ERROR', msg, 422); }
  static server(msg = 'Server error')          { return new AppError('SERVER_ERROR',     msg, 500); }
  static unknown(e?: unknown) {
    const msg = e instanceof Error ? e.message : 'An unexpected error occurred';
    return new AppError('UNKNOWN', msg);
  }

  get isAuthError() {
    return this.code === 'UNAUTHORIZED' || this.code === 'TOKEN_EXPIRED';
  }
}