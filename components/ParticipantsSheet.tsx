"use client";

import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Separator,
  Drawer,
  HStack,
  Text,
  VStack,
  CloseButton,
} from "@chakra-ui/react";
import { api } from "@/lib/api";
import { RegistrationStatus, type WorldEvent } from "@/types/model";
import { useTranslations } from "next-intl";

type Item = {
  id: string;
  status: "CONFIRMED" | "RESERVED";
  user?: { name?: string | null; email?: string | null; image?: string | null };
  createdAt: string | Date;
};

export default function ParticipantsSheet({
  event,
  trigger,
}: {
  event: WorldEvent;
  trigger: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [regs, setRegs] = useState<Item[]>(event.regs);
  const t = useTranslations("participants");

  const { confirmed, reserved } = useMemo(() => {
    const confirmed = regs.filter(
      (p) => p.status === RegistrationStatus.CONFIRMED,
    );
    const reserved = regs.filter(
      (p) => p.status === RegistrationStatus.RESERVED,
    );
    return { confirmed, reserved };
  }, [regs]);

  const show = async () => {
    const regs = await api.events.participants(event.id);
    setRegs(regs);
    setIsOpen(true);
  };

  // TODO extract function to render the list

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => {
        setIsOpen(e.open);
      }}
      placement="bottom"
    >
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        {React.cloneElement(trigger, {
          onClick: show,
        })}
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content roundedTop="2xl">
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
          <Drawer.Header>
            <Drawer.Title textAlign="center">
              {t("participants_label")}
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Text fontSize="sm" color="gray.600" mb={2}>
              {t("confirmed_label")} ({confirmed.length})
            </Text>
            <VStack
              align="stretch"
              gap={3}
              maxH="30dvh"
              overflowY="auto"
              mb={4}
            >
              {confirmed.map((it) => (
                <HStack key={it.id} borderWidth="1px" rounded="xl" p={3}>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback name={it.user?.name ?? "Anonymous"} />
                    <Avatar.Image src={it.user?.image ?? undefined} />
                  </Avatar.Root>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      {it.user?.name ?? "Anonymous"}
                    </Text>
                    {it.user?.email && (
                      <Text fontSize="xs" color="gray.500">
                        {it.user.email}
                      </Text>
                    )}
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(it.createdAt).toLocaleTimeString()}
                  </Text>
                </HStack>
              ))}
            </VStack>
            <Separator />
            <Text fontSize="sm" color="gray.600" mt={4} mb={2}>
              {t("reserved_label")} ({reserved.length})
            </Text>
            <VStack align="stretch" gap={3} maxH="30dvh" overflowY="auto">
              {reserved.map((it) => (
                <HStack key={it.id} borderWidth="1px" rounded="xl" p={3}>
                  <Avatar.Root size="sm">
                    <Avatar.Fallback name={it.user?.name ?? "Anonymous"} />
                    <Avatar.Image src={it.user?.image ?? undefined} />
                  </Avatar.Root>
                  <Box flex="1">
                    <Text fontSize="sm" fontWeight="medium">
                      {it.user?.name ?? "Anonymous"}
                    </Text>
                    {it.user?.email && (
                      <Text fontSize="xs" color="gray.500">
                        {it.user.email}
                      </Text>
                    )}
                  </Box>
                  <Text fontSize="xs" color="gray.500">
                    {new Date(it.createdAt).toLocaleTimeString()}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
