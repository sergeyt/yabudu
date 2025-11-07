import { NextResponse } from "next/server";

export class HttpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    status: number,
    message: string,
    opts?: { code?: string; details?: unknown; cause?: unknown },
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = opts?.code;
    this.details = opts?.details;
    if (opts?.cause) {
      (this as any).cause = opts.cause;
    }
  }
}

export class NotFoundError extends HttpError {
  constructor(
    message = "Not found",
    opts?: { code?: string; details?: unknown; cause?: unknown },
  ) {
    super(404, message, opts);
  }
}

export class BadRequestError extends HttpError {
  constructor(
    message = "Bad request",
    opts?: { code?: string; details?: unknown; cause?: unknown },
  ) {
    super(400, message, opts);
  }
}

type Route = (req: Request, ctx?: any) => Promise<any>;

export function withErrorHandling(fn: Route): Route {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err: any) {
      if (err instanceof HttpError) {
        return NextResponse.json(
          {
            error: err.message,
            code: err.code,
            details: err.details,
          },
          { status: err.status },
        );
      }

      // TODO log to Sentry
      // Unknown error fallback
      console.error(err);

      return NextResponse.json(
        { error: err?.message || "Internal Server Error" },
        { status: err?.status || 500 },
      );
    }
  };
}
