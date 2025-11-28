import { NextResponse } from "next/server";

type ErrorOptions = { code?: string; details?: unknown; cause?: unknown };

export class HttpError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(status: number, message: string, opts?: ErrorOptions) {
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
  constructor(message = "Not found", opts?: ErrorOptions) {
    super(404, message, opts);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Bad request", opts?: ErrorOptions) {
    super(400, message, opts);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", opts?: ErrorOptions) {
    super(403, message, opts);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized", opts?: ErrorOptions) {
    super(401, message, opts);
  }
}

export type RouteContext<TParams = any> = {
  params: TParams;
};
type Route<TParams = any> = (
  req: Request,
  ctx?: RouteContext<TParams>,
) => Promise<any>;

export function errorMiddleware<TParams = any>(
  fn: Route<TParams>,
): Route<TParams> {
  return async (req, ctxFromNext?: RouteContext<TParams>) => {
    try {
      let ctx = ctxFromNext;
      if (!ctxFromNext?.params) {
        const url = new URL(req.url);

        const queryParams = Object.fromEntries(
          url.searchParams.entries(),
        ) as Partial<TParams>;

        const mergedParams: TParams = {
          ...(ctxFromNext?.params ?? {}),
          ...queryParams,
        } as TParams;
        ctx = { params: mergedParams };
      }

      const resp = await fn(req, ctx);
      if (resp === undefined) {
        return NextResponse.json({ ok: true }, { status: 200 });
      }
      if (resp instanceof NextResponse) {
        return resp;
      }
      return NextResponse.json(resp, { status: 200 });
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
