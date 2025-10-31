"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function canRegisterNow(start: Date) {
  const now = new Date();
  const openAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  return now >= openAt && now < start;
}

// ---------- Roles & Permissions ----------
export async function isSuperAdmin() {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return false;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  // TODO reuse enum
  return user?.role === "SUPERADMIN";
}

export async function isPlaceAdmin(placeId: string) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return false;
  const admin = await prisma.placeAdmin.findUnique({
    where: { userId_placeId: { userId, placeId } },
  });
  return !!admin;
}

// ---------- Places (super-admin) ----------
export async function listPlaces() {
  return prisma.place.findMany({ orderBy: { name: "asc" } });
}

export async function createPlace(input: {
  name: string;
  description?: string | null;
  infoUrl?: string | null;
}) {
  if (!(await isSuperAdmin())) throw new Error("Forbidden");
  await prisma.place.create({
    data: {
      name: input.name.trim(),
      description: input.description ?? null,
      infoUrl: input.infoUrl ?? null,
    },
  });
  revalidatePath("/");
}

export async function updatePlace(
  placeId: string,
  input: {
    name?: string;
    description?: string | null;
    infoUrl?: string | null;
  },
) {
  if (!(await isSuperAdmin())) {
    throw new Error("Forbidden");
  }
  await prisma.place.update({
    where: { id: placeId },
    data: {
      name: input.name,
      description: input.description ?? null,
      infoUrl: input.infoUrl ?? null,
    },
  });
  revalidatePath("/");
}

export async function addPlaceAdmin(placeId: string, userEmail: string) {
  const session = await auth();
  const requesterId = (session?.user as any)?.id;
  if (!requesterId) {
    throw new Error("Unauthorized");
  }
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
    select: { role: true },
  });
  const requesterIsPlaceAdmin = await prisma.placeAdmin.findFirst({
    where: { userId: requesterId, placeId },
  });
  if (!(requester?.role === "SUPERADMIN" || requesterIsPlaceAdmin))
    throw new Error("Forbidden");

  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error("User not found");
  await prisma.placeAdmin.upsert({
    where: { userId_placeId: { userId: user.id, placeId } },
    create: { userId: user.id, placeId },
    update: {},
  });
}

// ---------- Events (place-admin or super-admin) ----------
export async function listPlaceEvents(placeId: string) {
  return prisma.event.findMany({
    where: { placeId },
    orderBy: { startAt: "asc" },
  });
}

export async function createEvent(input: {
  placeId: string;
  title: string;
  startAt: string;
  capacity?: number | null;
  reserveCapacity?: number | null;
}) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Unauthorized");
  const admin = await prisma.placeAdmin.findUnique({
    where: { userId_placeId: { userId, placeId: input.placeId } },
  });
  const superAdmin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!admin && superAdmin?.role !== "SUPERADMIN") throw new Error("Forbidden");

  const startDate = new Date(input.startAt);
  if (Number.isNaN(startDate.getTime())) throw new Error("Invalid date");
  await prisma.event.create({
    data: {
      placeId: input.placeId,
      title: input.title.trim(),
      startAt: startDate,
      capacity: input.capacity ?? null,
      reserveCapacity: input.reserveCapacity ?? null,
    },
  });
  revalidatePath("/");
}

// ---------- Registration flows ----------
export async function getUpcomingEvent(placeId: string) {
  return prisma.event.findFirst({
    where: { placeId, startAt: { gt: new Date() } },
    orderBy: { startAt: "asc" },
    include: { regs: { include: { user: true } } },
  });
}

export async function getParticipants(eventId: string) {
  return prisma.registration.findMany({
    where: { eventId },
    include: { user: true },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });
}

export async function registerForEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) throw new Error("Event not found");
    if (!canRegisterNow(event.startAt))
      throw new Error(
        "Registration opens 24h before start and closes at start.",
      );

    const existing = await tx.registration.findUnique({
      where: { userId_eventId: { userId: (session.user as any).id, eventId } },
    });
    if (existing) return;

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
      if (reserveCount >= reserveCap)
        throw new Error("Event and reserve list are full");
      status = "RESERVED";
    }

    await tx.registration.create({
      data: { userId: (session.user as any).id, eventId, status },
    });
  });

  revalidatePath("/");
}

export async function unregisterFromEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.registration
      .delete({
        where: {
          userId_eventId: { userId: (session.user as any).id, eventId },
        },
      })
      .catch(() => {});

    const event = await tx.event.findUnique({ where: { id: eventId } });
    if (!event) return;
    const confirmedCap = event.capacity ?? Number.POSITIVE_INFINITY;
    const confirmedCount = await tx.registration.count({
      where: { eventId, status: "CONFIRMED" },
    });
    if (confirmedCount >= confirmedCap) return;

    const nextWait = await tx.registration.findFirst({
      where: { eventId, status: "RESERVED" },
      orderBy: { createdAt: "asc" },
    });
    if (nextWait)
      await tx.registration.update({
        where: { id: nextWait.id },
        data: { status: "CONFIRMED" },
      });
  });

  revalidatePath("/");
}
