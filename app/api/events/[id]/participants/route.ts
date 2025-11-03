import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: eventId } = await params;
  const regs = await prisma.registration.findMany({
    where: { eventId },
    include: { user: true },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(regs);
}
