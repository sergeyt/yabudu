import { prisma } from "@/lib/prisma";
import type { ChannelType } from "@/types/model";

export type Channel = {
  type: ChannelType;
  target: string;
  meta?: Record<string, any> | null;
  label?: string | null;
};

export async function getEffectiveChannelsForEvent(
  eventId: string,
): Promise<Channel[]> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      id: true,
      placeId: true,
      channels: {
        select: {
          type: true,
          target: true,
          meta: true,
          label: true,
        },
      },
      place: {
        select: {
          channels: {
            select: { type: true, target: true, meta: true, label: true },
          },
        },
      },
    },
  });
  if (!event) {
    return [];
  }

  const placeChannels = event.place.channels;
  const eventChannels = event.channels;
  const eventTypes = Object.groupBy(eventChannels, (c: any) => c.type);

  return eventChannels.concat(
    placeChannels.filter((c: any) => !eventTypes[c.type]?.length),
  ) as Channel[];
}
