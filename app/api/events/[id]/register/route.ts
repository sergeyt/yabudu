import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-auth";
import { canRegisterNow } from "@/lib/util";
import { notifyEventChange } from "@/lib/notifications/notify";

// register
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: eventId } = await params;
  const { userId } = await requireUser();

  let outcome: "CONFIRMED" | "RESERVED" | null = null;
  let actorName: string | null = null;

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
    // gate checks...

    const sessionUser = await tx.user.findUnique({ where: { id: userId } });
    actorName = sessionUser?.name ?? sessionUser?.email ?? null;

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
    outcome = status;

    await tx.registration.create({
      data: { userId, eventId, status },
    });
  });

  // Fire-and-forget (no await inside response if you prefer)
  try {
    await notifyEventChange({
      eventId,
      type: outcome === "CONFIRMED" ? "REGISTERED" : "WAITLISTED",
      actorName,
    });
  } catch {}

  return NextResponse.json({ ok: true }, { status: 201 });
}

// unregister
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: eventId } = await params;
  const { userId } = await requireUser();

  let actorName: string | null = null;
  let promotedName: string | null = null;
  let wasPromoted = false;

  await prisma.$transaction(async (tx) => {
    const me = await tx.user.findUnique({ where: { id: userId } });
    actorName = me?.name ?? me?.email ?? null;

    await tx.registration
      .delete({
        where: { userId_eventId: { userId, eventId } },
      })
      .catch(() => {});

    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return;
    }

    const confirmedCap = event.capacity ?? Number.POSITIVE_INFINITY;
    const confirmedCount = await tx.registration.count({
      where: { eventId, status: "CONFIRMED" },
    });
    if (confirmedCount < confirmedCap) {
      const nextWait = await tx.registration.findFirst({
        where: { eventId, status: "RESERVED" },
        orderBy: { createdAt: "asc" },
      });
      if (nextWait) {
        const promoted = await tx.user.findUnique({
          where: { id: nextWait.userId },
        });
        promotedName = promoted?.name ?? promoted?.email ?? null;
        await tx.registration.update({
          where: { id: nextWait.id },
          data: { status: "CONFIRMED" },
        });
        wasPromoted = true;
      }
    }
  });

  // notify channel about unregistration
  try {
    await notifyEventChange({
      eventId,
      type: "UNREGISTERED",
      actorName,
    });
    if (wasPromoted) {
      await notifyEventChange({
        eventId,
        type: "PROMOTED",
        promotedName,
      });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
