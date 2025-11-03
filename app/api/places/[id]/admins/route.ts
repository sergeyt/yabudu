import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isSuperAdmin, isPlaceAdmin } from "@/lib/api-auth";
import { AddPlaceAdmin } from "@/lib/validation";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await requireUser();
  const { id: placeId } = await params;
  const requesterIsAllowed =
    (await isSuperAdmin(userId)) || (await isPlaceAdmin(userId, placeId));
  if (!requesterIsAllowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = AddPlaceAdmin.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const user = await prisma.user.findUnique({
    where: { email: parsed.data.userEmail },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const admin = await prisma.placeAdmin.upsert({
    where: { userId_placeId: { userId: user.id, placeId } },
    create: { userId: user.id, placeId },
    update: {},
  });
  return NextResponse.json(admin, { status: 201 });
}
