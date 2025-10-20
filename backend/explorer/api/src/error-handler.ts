// src/plugins/errorHandler.ts
import { DomainError } from "@application/errors";
import Elysia from "elysia";

// Helper untuk bikin body JSON standar
function buildErrorBody(error: DomainError, request: Request, path: string) {
  return {
    error: error.code,
    message: error.message,
    path,
    details: error.details ?? null,
    ...(process.env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  };
}

export function registerErrorHandler(app: Elysia) {
  app.onError(({ code, error, set, request, path}) => {
    console.error("🔥 Global Error:", error);

    if (error instanceof DomainError) {
        switch (error.code) {
            case 'VALIDATION_ERROR':
            set.status = 400;
            return buildErrorBody(error, request, path);
            case 'NOT_FOUND':
            set.status = 404;
            return buildErrorBody(error, request, path);
            case 'UNAUTHORIZED':
            set.status = 401;
            return buildErrorBody(error, request, path);
            case 'CONFLICT':
            set.status = 409;
            return buildErrorBody(error, request, path);
            default:
            set.status = 400;
            return buildErrorBody(error, request, path);
        }
    }

    // validasi internal Elysia (schema t.Object)
    if (code === 'VALIDATION') {
        set.status = 400;
        return {
            error: 'VALIDATION_FAILED',
            message: 'Input validation error',
            issues: (error as any)?.all ?? (error as any)?.message
        };
    }

    // Tangani error teknis tak dikenal → 500
    console.error('🔥 Unexpected error:', error);
    set.status = 500;
    return {
        error: 'INTERNAL_SERVER_ERROR',
        message:
            process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : (error as any)?.message,
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined
    };
  });
}
