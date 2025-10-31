import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser, isSuperAdmin } from "@/lib/api-auth";
import { CreatePlace } from "@/lib/validation";

export async function GET() {
  const places = await prisma.place.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(places);
}

export async function POST(req: Request) {
  const { userId } = await requireUser();
  if (!(await isSuperAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json();
  const parsed = CreatePlace.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const place = await prisma.place.create({ data: parsed.data });
  return NextResponse.json(place, { status: 201 });
}
