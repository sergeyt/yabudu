import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { canRegisterNow } from "@/lib/util";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { userId } = await requireUser();
  const eventId = params.id;
  try {
    await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) {
        throw Object.assign(new Error("Event not found"), { status: 404 });
      }
      if (!canRegisterNow(event.startAt)) {
        throw Object.assign(
          new Error("Registration opens 24h before start and closes at start."),
          { status: 400 },
        );
      }

      const existing = await tx.registration.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });
      if (existing) {
        // idempotent
        return;
      }

      const confirmedCount = await tx.registration.count({
        where: { eventId, status: "CONFIRMED" },
      });
      const reserveCount = await tx.registration.count({
        where: { eventId, status: "RESERVED" },
      });

      const confirmedCap = event.capacity ?? Number.POSITIVE_INFINITY;
      const reserveCap = event.reserveCapacity ?? Number.POSITIVE_INFINITY;

      let status: "CONFIRMED" | "RESERVED" = "CONFIRMED";
      if (confirmedCount >= confirmedCap) {
        if (reserveCount >= reserveCap) {
          throw Object.assign(new Error("Event and reserve list are full"), {
            status: 409,
          });
        }
        status = "RESERVED";
      }

      await tx.registration.create({ data: { userId, eventId, status } });
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: e?.status || 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = await requireUser();
  const eventId = params.id;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.registration
        .delete({ where: { userId_eventId: { userId, eventId } } })
        .catch(() => {});
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) {
        return;
      }
      const confirmedCap = event.capacity ?? Number.POSITIVE_INFINITY;
      const confirmedCount = await tx.registration.count({
        where: { eventId, status: "CONFIRMED" },
      });
      if (confirmedCount >= confirmedCap) {
        return;
      }
      const nextWait = await tx.registration.findFirst({
        where: { eventId, status: "RESERVED" },
        orderBy: { createdAt: "asc" },
      });
      if (nextWait) {
        await tx.registration.update({
          where: { id: nextWait.id },
          data: { status: "CONFIRMED" },
        });
      }
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed" },
      { status: e?.status || 500 },
    );
  }
}
