import { handlers } from "@/lib/auth";

// Ensure Node.js runtime (Prisma + NextAuth)
export const runtime = "nodejs";

// Correctly export GET and POST from the handlers object
export const { GET, POST } = handlers;
