"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Badge, Box, Button, HStack, Link, Text } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import {
  type DateLike,
  type Registration,
  RegistrationStatus,
} from "@/types/model";
import { countBy, toDateTime } from "@/lib/util";
import ParticipantsSheet from "./ParticipantsSheet";

function within24h(startAt: string) {
  const start = new Date(startAt);
  const openAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const now = new Date();
  return now >= openAt && now < start;
}

export function formatEventDate(dateInput: DateLike): string {
  const dt = toDateTime(dateInput);
  const now = DateTime.local();
  const time = dt.toFormat("HH:mm");

  if (dt.hasSame(now, "day")) {
    return `Today at ${time}`;
  }

  if (dt.hasSame(now.plus({ days: 1 }), "day")) {
    return `Tomorrow at ${time}`;
  }

  // otherwise → short month and day (include year if different)
  const includeYear = dt.year !== now.year;
  const date = dt.toFormat(includeYear ? "MMM d, yyyy" : "MMM d");
  return `${date} at ${time}`;
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

  const { confirmedCount, reservedCount, myReg, canReg } = useMemo(() => {
    const counts = countBy(regs, "status", {
      [RegistrationStatus.CONFIRMED]: 0,
      [RegistrationStatus.RESERVED]: 0,
    });
    const confirmedCount = counts[RegistrationStatus.CONFIRMED];
    const reservedCount = counts[RegistrationStatus.RESERVED];
    const myReg = regs.find((r) => r.userId === userId);
    const canReg = !!event && within24h(event.startAt);
    return { confirmedCount, reservedCount, myReg, canReg };
  }, [event, regs]);

  if (!event) {
    return (
      <Box borderWidth="1px" rounded="xl" p={4} bg="white">
        <Text fontSize="sm">{t("no_upcoming_event")}</Text>
      </Box>
    );
  }

  const confirmedCap =
    typeof event.capacity === "number" ? event.capacity : Infinity;
  const reserveCap =
    typeof event.reserveCapacity === "number"
      ? event.reserveCapacity
      : Infinity;
  const confirmedFull = confirmedCount >= confirmedCap;
  const reserveFull = reservedCount >= reserveCap;

  const renderCounts = () => {
    return (
      <HStack>
        <Badge colorScheme={confirmedFull ? "red" : "green"}>
          {confirmedCount}
          {reservedCount > 0 && <>({reservedCount})</>}
          {Number.isFinite(confirmedCap) ? event.capacity : "∞"}
        </Badge>
        <Badge colorScheme={reserveFull ? "red" : "purple"}>
          {reservedCount}/
          {Number.isFinite(reserveCap) ? event.reserveCapacity : "∞"}
        </Badge>
      </HStack>
    );
  };

  const renderTitle = () => {
    const at = formatEventDate(event.startAt);
    // render info about capacity
    /*
      {typeof event.capacity === "number" && (
            <Badge>Capacity {event.capacity}</Badge>
          )}
          {typeof event.reserveCapacity === "number" && (
            <Badge colorScheme="purple">Reserve {event.reserveCapacity}</Badge>
          )}
     */
    return (
      <HStack w="full" justifyContent="space-between">
        <HStack>
          <Text fontWeight="medium">{event.title}</Text>
          <Box>{at}</Box>
        </HStack>
        {renderCounts()}
      </HStack>
    );
  };

  const register = () =>
    startTransition(async () => {
      try {
        await api.events.register(event.id);
        const regs = await api.events.participants(event.id);
        setRegs(regs as any);
      } catch (e: any) {
        toast.error({ title: e?.message || "Could not register" });
      }
    });

  const unregister = () =>
    startTransition(async () => {
      try {
        await api.events.unregister(event.id);
        const regs = await api.events.participants(event.id);
        setRegs(regs as any);
      } catch (e: any) {
        toast.error({ title: e?.message || "Could not unregister" });
      }
    });

  const renderCTA = () => {
    const primaryCta = !myReg
      ? confirmedFull
        ? reserveFull
          ? "Full"
          : "Join Waitlist"
        : "Register"
      : myReg.status === RegistrationStatus.CONFIRMED
        ? "Unregister"
        : "Leave Waitlist";
    return (
      <Button
        onClick={myReg ? unregister : register}
        w="full"
        disabled={
          myReg
            ? isPending
            : isPending || !canReg || (!myReg && confirmedFull && reserveFull)
        }
        loading={isPending}
        colorScheme={myReg ? undefined : confirmedFull ? "purple" : "blue"}
        variant={
          myReg
            ? myReg.status === RegistrationStatus.CONFIRMED
              ? "danger"
              : "ghost"
            : undefined
        }
      >
        {primaryCta}
      </Button>
    );
  };

  const renderError = () => {
    return (
      <>
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
      </>
    );
  };

  const renderLinks = () => {
    return (
      <HStack gap={1}>
        <ParticipantsSheet event={event} />
        <Link href="/admin" fontSize="xs" color="blue.600">
          Admin
        </Link>
      </HStack>
    );
  };

  return (
    <Box borderWidth="1px" rounded="xl" p={4} bg="white" display="grid" gap={3}>
      {renderTitle()}
      <Box w="full">
        {renderCTA()}
        {renderError()}
      </Box>
      <Box>{renderLinks()}</Box>
    </Box>
  );
}
