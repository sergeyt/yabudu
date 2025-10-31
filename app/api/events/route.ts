import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isPlaceAdmin, isSuperAdmin } from "@/lib/api-auth";
import { CreateEvent } from "@/lib/validation";
import { toDateTime } from "@/lib/util";

export async function POST(req: Request) {
  const { userId } = await requireUser();
  const body = await req.json();
  const parsed = CreateEvent.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { placeId } = parsed.data;
  const allowed =
    (await isSuperAdmin(userId)) || (await isPlaceAdmin(userId, placeId));
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const startDate = toDateTime(parsed.data.startAt);
  if (!startDate.isValid) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const event = await prisma.event.create({
    data: { ...parsed.data, startAt: startDate.toJSDate() },
  });
  return NextResponse.json(event, { status: 201 });
}
