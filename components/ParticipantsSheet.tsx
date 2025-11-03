"use client";

import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Separator,
  Drawer,
  HStack,
  Text,
  VStack,
  CloseButton,
} from "@chakra-ui/react";
import { api } from "@/lib/api";

type Item = {
  id: string;
  status: "CONFIRMED" | "RESERVED";
  user?: { name?: string | null; email?: string | null; image?: string | null };
  createdAt: string | Date;
};

export default function ParticipantsSheet({
  event,
}: {
  // TODO typed event
  event: any | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [regs, setRegs] = useState<Item[]>(event?.regs ?? []);

  const { confirmed, reserved } = useMemo(() => {
    const confirmed = regs.filter((p) => p.status === "CONFIRMED");
    const reserved = regs.filter((p) => p.status === "RESERVED");
    return { confirmed, reserved };
  }, [regs]);

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
        <Button
          variant="link"
          size="sm"
          onClick={async () => {
            const regs = await api.events.participants(event.id);
            setRegs(regs);
            setIsOpen(true);
          }}
        >
          Participants
        </Button>
      </Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content roundedTop="2xl">
          <Drawer.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Drawer.CloseTrigger>
          <Drawer.Header>
            <Drawer.Title textAlign="center">Participants</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Confirmed ({confirmed.length})
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
              Reserved ({reserved.length})
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
