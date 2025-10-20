export class DomainError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, code = 'DOMAIN_ERROR', details?: unknown) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
    this.details = details;
    // maintain proper stack trace (TS -> JS)
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends DomainError {
  constructor(entity = 'Resource', details?: unknown) {
    super(`${entity} not found`, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = 'Unauthorized', details?: unknown) {
    super(message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends DomainError {
  constructor(message = 'Conflict', details?: unknown) {
    super(message, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}
