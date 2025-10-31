"use client";

import { useTransition, useState, useMemo } from "react";
import { api } from "@/lib/api";
import ParticipantsSheet from "./ParticipantsSheet";
import {
  Box,
  Button,
  Text,
  HStack,
  Badge,
  VStack,
  Link,
} from "@chakra-ui/react";
import { toast } from "@/components/ui/toaster";

function within24h(startAt: string) {
  const start = new Date(startAt);
  const openAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const now = new Date();
  return now >= openAt && now < start;
}

type Reg = {
  id: string;
  userId: string;
  status: "CONFIRMED" | "RESERVED";
};

export default function RegisterPanel({
  event,
  userId,
}: {
  event: any | null;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [regs, setRegs] = useState<Reg[]>(event?.regs ?? []);

  const { confirmedCount, reservedCount } = useMemo(
    () => ({
      confirmedCount: regs.filter((r) => r.status === "CONFIRMED").length,
      reservedCount: regs.filter((r) => r.status === "RESERVED").length,
    }),
    [regs],
  );

  if (!event) {
    return (
      <Box borderWidth="1px" rounded="xl" p={4} bg="white">
        <Text fontSize="sm">No upcoming event for this place.</Text>
      </Box>
    );
  }

  const me = regs.find((r) => r.userId === userId);
  const canReg = within24h(event.startAt);

  const confirmedCap =
    typeof event.capacity === "number" ? event.capacity : Infinity;
  const reserveCap =
    typeof event.reserveCapacity === "number"
      ? event.reserveCapacity
      : Infinity;
  const confirmedFull = confirmedCount >= confirmedCap;
  const reserveFull = reservedCount >= reserveCap;

  const primaryCta = !me
    ? confirmedFull
      ? reserveFull
        ? "Full"
        : "Join Waitlist"
      : "Register"
    : me.status === "CONFIRMED"
      ? "Unregister"
      : "Leave Waitlist";

  const disablePrimary =
    isPending || !canReg || (!me && confirmedFull && reserveFull);

  return (
    <Box borderWidth="1px" rounded="xl" p={4} bg="white" display="grid" gap={3}>
      <HStack justify="space-between" align="start">
        <Box>
          <Text fontSize="sm" color="gray.500">
            Next event
          </Text>
          <HStack>
            <Text fontWeight="medium">{event.title}</Text>
            {typeof event.capacity === "number" && (
              <Badge>Cap {event.capacity}</Badge>
            )}
            {typeof event.reserveCapacity === "number" && (
              <Badge colorScheme="purple">
                Reserve {event.reserveCapacity}
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color="gray.600">
            Starts: {new Date(event.startAt).toLocaleString()}
          </Text>
        </Box>
        <VStack gap={1} align="end">
          <ParticipantsSheet event={event} />
          <HStack>
            <Badge colorScheme={confirmedFull ? "red" : "green"}>
              {confirmedCount}/
              {Number.isFinite(confirmedCap) ? event.capacity : "∞"}
            </Badge>
            <Badge colorScheme={reserveFull ? "red" : "purple"}>
              {reservedCount}/
              {Number.isFinite(reserveCap) ? event.reserveCapacity : "∞"}
            </Badge>
          </HStack>
          <Link href="/admin" fontSize="xs" color="blue.600">
            Admin
          </Link>
        </VStack>
      </HStack>

      {!me ? (
        <Button
          disabled={disablePrimary}
          loading={isPending}
          colorScheme={confirmedFull ? "purple" : "blue"}
          onClick={() =>
            startTransition(async () => {
              try {
                await api.events.register(event.id);
                const regs = await api.events.participants(event.id);
                setRegs(regs as any);
              } catch (e: any) {
                toast.error({ title: e?.message || "Could not register" });
              }
            })
          }
        >
          {primaryCta}
        </Button>
      ) : (
        <Button
          variant={me.status === "CONFIRMED" ? "outline" : "ghost"}
          disabled={isPending}
          loading={isPending}
          onClick={() =>
            startTransition(async () => {
              try {
                await api.events.unregister(event.id);
                const regs = await api.events.participants(event.id);
                setRegs(regs as any);
              } catch (e: any) {
                toast.error({ title: e?.message || "Could not unregister" });
              }
            })
          }
        >
          {primaryCta}
        </Button>
      )}

      {!canReg && (
        <Text fontSize="xs" color="orange.600">
          Registration opens 24 hours before start and closes at start.
        </Text>
      )}
      {confirmedFull && !reserveFull && (
        <Text fontSize="xs" color="purple.600">
          Main capacity reached. You can join the waitlist.
        </Text>
      )}
      {confirmedFull && reserveFull && (
        <Text fontSize="xs" color="red.600">
          Both capacities are full.
        </Text>
      )}
    </Box>
  );
}
