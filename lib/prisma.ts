// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const retryCount = Number(process.env.DATABASE_RETRY ?? 0);
const hasRetry = retryCount > 0;

function isTransient(err: unknown): boolean {
  const msg = (err as Error)?.message ?? "";
  return (
    msg.includes("P1001") || // Can't reach database server
    msg.includes("P1002") || // The database server was reached but timed out
    msg.includes("P2024") || // Timed out waiting for a connection from the pool
    /ECONNREFUSED|ETIMEDOUT|EOF|Connection terminated/i.test(msg)
  );
}

// Base Prisma client
const base = globalForPrisma.prisma ?? new PrismaClient();

// Conditional retry extension
const prisma = hasRetry
  ? base.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            const max = retryCount;
            let attempt = 0;
            while (true) {
              try {
                return await query(args);
              } catch (err) {
                attempt++;
                if (attempt >= max || !isTransient(err)) {
                  throw err;
                }
                const delay = 200 * attempt;
                console.warn(
                  `[Prisma Retry] ${model}.${operation} transient error → retry ${attempt}/${max} after ${delay}ms`,
                );
                await new Promise((r) => setTimeout(r, delay));
              }
            }
          },
        },
      },
    })
  : base;

if (process.env.NODE_ENV !== "production") {
  (globalForPrisma as any).prisma = prisma;
}

export { prisma };
