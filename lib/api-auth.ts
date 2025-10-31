import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
  return { session, userId: (session.user as any).id as string };
}

export async function isSuperAdmin(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return u?.role === "SUPERADMIN";
}

export async function isPlaceAdmin(userId: string, placeId: string) {
  const admin = await prisma.placeAdmin.findUnique({
    where: { userId_placeId: { userId, placeId } },
  });
  return !!admin;
}
