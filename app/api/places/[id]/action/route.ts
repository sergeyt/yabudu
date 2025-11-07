import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { requireUser } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { NotFoundError, errorMiddleware } from "@/lib/error";

export const POST = errorMiddleware(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id: placeId } = await params;
    await requireUser();
    const body = await req.json();
    // TODO validate payload

    await prisma.$transaction(async (tx) => {
      const place = await tx.place.findUnique({ where: { id: placeId } });
      if (!place) {
        throw new NotFoundError("Place not found");
      }

      console.log("action payload", body);

      switch (body.type) {
        case "reuse_event": {
          const event = await tx.event.findFirst({
            where: { placeId },
            orderBy: { startAt: "desc" },
          });
          if (!event) {
            throw new NotFoundError("No event in the given place");
          }

          const startAt = DateTime.now()
            .startOf("day")
            .set({ hour: 19 })
            .toJSDate();

          await tx.event.update({
            where: { id: event.id },
            data: {
              startAt,
            },
          });
        }
      }
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  },
);
