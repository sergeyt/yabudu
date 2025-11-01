"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Badge,
  Box,
  Button,
  HStack,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import { type Registration, RegistrationStatus } from "@/types/model";
import { countBy } from "@/lib/util";
import ParticipantsSheet from "./ParticipantsSheet";

function within24h(startAt: string) {
  const start = new Date(startAt);
  const openAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const now = new Date();
  return now >= openAt && now < start;
}

export default function RegisterPanel({
  event,
  userId,
}: {
  event: any | null;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [regs, setRegs] = useState<Registration[]>(event?.regs ?? []);
  const t = useTranslations("register");

  const counts = useMemo(
    () =>
      countBy(regs, "status", {
        [RegistrationStatus.CONFIRMED]: 0,
        [RegistrationStatus.RESERVED]: 0,
      }),
    [regs],
  );
  const confirmedCount = counts[RegistrationStatus.CONFIRMED];
  const reservedCount = counts[RegistrationStatus.RESERVED];

  if (!event) {
    return (
      <Box borderWidth="1px" rounded="xl" p={4} bg="white">
        <Text fontSize="sm">{t("no_upcoming_event")}</Text>
      </Box>
    );
  }

  // TODO extract this computed state to useMemo
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
          variant={
            me.status === RegistrationStatus.CONFIRMED ? "outline" : "ghost"
          }
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
