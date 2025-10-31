import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const events = await prisma.event.findMany({
    where: { placeId: params.id },
    orderBy: { startAt: "asc" },
  });
  return NextResponse.json(events);
}
