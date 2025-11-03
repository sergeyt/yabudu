import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  const { id: placeId } = await params;
  const events = await prisma.event.findMany({
    where: { placeId },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json(events);
}
