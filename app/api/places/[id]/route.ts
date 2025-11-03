import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isSuperAdmin } from "@/lib/api-auth";
import { UpdatePlace } from "@/lib/validation";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  const { id: placeId } = await params;
  const place = await prisma.place.findUnique({
    where: { id: placeId },
    include: { admins: { include: { user: true } }, events: true },
  });
  if (!place) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(place);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: placeId } = await params;
  const { userId } = await requireUser();
  if (!(await isSuperAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = UpdatePlace.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const place = await prisma.place.update({
    where: { id: placeId },
    data: parsed.data,
  });
  return NextResponse.json(place);
}
