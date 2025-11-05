// lib/prisma.ts
import { PrismaClient, Prisma } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const retryCount = Number(process.env.DATABASE_RETRY ?? 0);

function isTransient(err: unknown): boolean {
  const msg = (err as Error)?.message ?? "";
  return (
    msg.includes("P1001") || // can't reach DB
    msg.includes("P1002") || // reached but timed out
    msg.includes("P2024") || // pool wait timeout
    /ECONNREFUSED|ETIMEDOUT|EOF|Connection terminated/i.test(msg)
  );
}

const retryExtension = Prisma.defineExtension((client) =>
  client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (retryCount <= 0) {
            return query(args);
          }
          let attempt = 0;
          while (true) {
            try {
              return await query(args);
            } catch (err) {
              attempt++;
              if (attempt >= retryCount || !isTransient(err)) {
                throw err;
              }
              const delay = 200 * attempt;
              console.warn(
                `[Prisma Retry] ${model}.${operation} retry ${attempt}/${retryCount} after ${delay}ms`,
              );
              await new Promise((r) => setTimeout(r, delay));
            }
          }
        },
      },
    },
  }),
);

const base = globalForPrisma.prisma ?? new PrismaClient();
export const prisma =
  retryCount > 0 ? (base.$extends(retryExtension) as typeof base) : base;

if (process.env.NODE_ENV !== "production") {
  (globalForPrisma as any).prisma = prisma;
}
