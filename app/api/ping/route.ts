import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    return NextResponse.json({ ok: true, ts: Date.now() });
  } catch (e: any) {
    // return 200 to avoid retry storms from schedulers, but log error
    console.error("keep-warm failed:", e?.message || e);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
