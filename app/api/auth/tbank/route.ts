// ensure Node runtime for NextAuth
export const runtime = "nodejs";
export { handlers as GET, handlers as POST } from "@/lib/auth";
