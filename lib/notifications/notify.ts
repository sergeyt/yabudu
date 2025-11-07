import { prisma } from "@/lib/prisma";
import { ChannelType } from "@/types/model";
import { getEffectiveChannelsForEvent } from "./effectiveChannels";
// TODO unify interface of sending message to given chat
import { sendMessage as sendMaxMessage } from "./transports/max";
import { sendTelegramMessage } from "./transports/telegram";

type ChangeType = "REGISTERED" | "WAITLISTED" | "UNREGISTERED" | "PROMOTED";

const PARTICIPANT_LIST_LIMIT = 15;

function displayName(u?: { name?: string | null; email?: string | null }) {
  return (u?.name || u?.email || "Anonymous").trim();
}

export async function notifyEventChange(opts: {
  eventId: string;
  type: ChangeType;
  actorName?: string | null;
  promotedName?: string | null;
}) {
  const event = await prisma.event.findUnique({
    where: { id: opts.eventId },
    include: { place: true },
  });
  if (!event) {
    // TODO log with winston
    console.log("Event not found");
    return;
  }

  const channels = await getEffectiveChannelsForEvent(event?.id);
  if (!channels.length) {
    // TODO log with winston
    console.log("No connected channels");
    return;
  }

  // Current counts
  const [confirmedCount, reservedCount] = await Promise.all([
    prisma.registration.count({
      where: { eventId: event.id, status: "CONFIRMED" },
    }),
    prisma.registration.count({
      where: { eventId: event.id, status: "RESERVED" },
    }),
  ]);

  // Pull participants (ordered: CONFIRMED first by createdAt, then RESERVED)
  const regs = await prisma.registration.findMany({
    where: { eventId: event.id },
    include: { user: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }], // "CONFIRMED" < "RESERVED"
  });

  // Prepare a compact list up to PARTICIPANT_LIST_LIMIT
  const confirmed = regs.filter((r) => r.status === "CONFIRMED");
  const reserved = regs.filter((r) => r.status === "RESERVED");

  const merged = [...confirmed, ...reserved];
  const truncated = merged.slice(0, PARTICIPANT_LIST_LIMIT);
  const remaining = merged.length - truncated.length;

  const participantLines = truncated.map((r) => {
    const icon = r.status === "CONFIRMED" ? "✅" : "⏳";
    return `${icon} ${displayName(r.user)}`;
  });

  // Header lines
  const when = new Date(event.startAt).toLocaleString();
  const place = event.place.name;

  const lines: string[] = [];

  switch (opts.type) {
    case "REGISTERED":
      lines.push(
        `✅ ${opts.actorName ?? "Someone"} registered for *${event.title}*`,
      );
      break;
    case "WAITLISTED":
      lines.push(
        `⏳ ${opts.actorName ?? "Someone"} joined the waitlist for *${event.title}*`,
      );
      break;
    case "UNREGISTERED":
      lines.push(
        `❎ ${opts.actorName ?? "Someone"} unregistered from *${event.title}*`,
      );
      break;
    case "PROMOTED":
      lines.push(
        `⬆️ ${opts.promotedName ?? "Someone"} was promoted from waitlist to confirmed for *${event.title}*`,
      );
      break;
  }

  lines.push(`📍 ${place}   🗓 ${when}`);
  lines.push(`👥 Confirmed: ${confirmedCount}   ⏳ Waitlist: ${reservedCount}`);

  // Participant section
  lines.push(`\nParticipants (showing up to ${PARTICIPANT_LIST_LIMIT}):`);
  lines.push(...participantLines);
  if (remaining > 0) {
    lines.push(`… and ${remaining} more`);
  }

  const message = lines.join("\n");

  for (const channel of channels) {
    switch (channel.type) {
      case ChannelType.TELEGRAM:
        await sendTelegramMessage({
          chatId: channel.target,
          parseMode: "MarkdownV2",
          text: message,
        });
        break;
      case ChannelType.MAX:
        await sendMaxMessage(channel.target, message);
        break;
    }
  }
}
