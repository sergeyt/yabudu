"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Badge, Box, Button, Heading, HStack, Text } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { api } from "@/lib/api";
import { toast } from "@/components/ui/toaster";
import {
  type DateLike,
  type Opt,
  type Registration,
  RegistrationStatus,
  type WorldEvent,
} from "@/types/model";
import { countBy, toDateTime } from "@/lib/util";
import ParticipantsSheet from "./ParticipantsSheet";

function within24h(startAt: DateLike) {
  const start = toDateTime(startAt).toJSDate();
  const openAt = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const now = new Date();
  return now >= openAt && now < start;
}

const formatCap = (val: number) => (Number.isFinite(val) ? val : "∞");

function formatEventDate(
  dateInput: DateLike,
  options: {
    t: (key: string) => string;
    locale: string;
  },
): string {
  const { t, locale } = options;
  const dt = toDateTime(dateInput);
  const now = DateTime.local();
  const time = dt.toFormat("HH:mm");

  if (dt.hasSame(now, "day")) {
    return `${t("today")} ${time}`;
  }

  if (dt.hasSame(now.plus({ days: 1 }), "day")) {
    return `${t("tomorrow")} ${time}`;
  }

  // otherwise → short month and day (include year if different)
  const includeYear = dt.year !== now.year;
  const date = dt.toFormat(includeYear ? "MMM d, yyyy" : "MMM d", { locale });
  return `${date} at ${time}`;
}

function useRandomLabel(labels: string[]) {
  return useState(() => labels[Math.floor(Math.random() * labels.length)])[0];
}

export default function RegisterPanel({
  event,
  userId,
}: {
  event: Opt<WorldEvent>;
  userId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [regs, setRegs] = useState<Registration[]>(event?.regs ?? []);
  const t = useTranslations("register");
  const err = useTranslations("errors");

  const labelVariants = useMemo(() => {
    const digits = Array.from({ length: 10 }, (_, i) => i + 1);
    const register = digits.map((k) => t(`register_label${k}`));
    const unregister = digits.map((k) => t(`unregister_label${k}`));
    const join = digits.map((k) => t(`join_label${k}`));
    const leave = digits.map((k) => t(`leave_label${k}`));
    return {
      register,
      unregister,
      join,
      leave,
    };
  }, [t]);
  const registerLabel = useRandomLabel(labelVariants.register);
  const unregisterLabel = useRandomLabel(labelVariants.unregister);
  const joinLabel = useRandomLabel(labelVariants.join);
  const leaveLabel = useRandomLabel(labelVariants.leave);

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
    const trigger = (
      <HStack cursor="pointer">
        <Badge colorScheme={confirmedFull ? "red" : "green"} px={1}>
          {confirmedCount}
          {reservedCount > 0 && (
            <>
              ({reservedCount}/{formatCap(reserveCap)})
            </>
          )}
          /{formatCap(confirmedCap)}
        </Badge>
      </HStack>
    );
    return <ParticipantsSheet event={event} trigger={trigger} />;
  };

  const renderTitle = () => {
    const at = formatEventDate(event.startAt, { t, locale: "ru" });
    // TODO render info about capacity
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
          <Heading size="md" color="text">
            {event.title}
          </Heading>
          <Box color="gray.400">{at}</Box>
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
          : joinLabel
        : registerLabel
      : myReg.status === RegistrationStatus.CONFIRMED
        ? unregisterLabel
        : leaveLabel;
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
    if (myReg) {
      return null;
    }
    return (
      <>
        {!canReg && (
          <Text fontSize="xs" color="orange.600">
            {err("too_early")}
          </Text>
        )}
        {confirmedFull && !reserveFull && (
          <Text fontSize="xs" color="purple.600">
            {err("cap_reached")}
          </Text>
        )}
        {confirmedFull && reserveFull && (
          <Text fontSize="xs" color="red.600">
            {err("full")}
          </Text>
        )}
      </>
    );
  };

  return (
    <Box borderWidth="1px" rounded="xl" p={4} bg="white" display="grid" gap={3}>
      {renderTitle()}
      <Box w="full">
        {renderCTA()}
        {renderError()}
      </Box>
    </Box>
  );
}
