import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const regs = await prisma.registration.findMany({
    where: { eventId: params.id },
    include: { user: true },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(regs);
}
