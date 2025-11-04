"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  CloseButton,
  createListCollection,
  Drawer,
  HStack,
  IconButton,
  Portal,
  Select,
  Separator,
  Text,
} from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";
import type { Place } from "@/types/model";
import { Tooltip } from "./ui/tooltip";

type Props = {
  places: Place[];
  currentId: string;
};

export default function PlacePicker({ places, currentId }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("place_picker");
  const [showInfo, setShowInfo] = useState(false);

  const collection = useMemo(
    () =>
      createListCollection({
        items: places.map((p) => ({ value: p.id, label: p.name })),
      }),
    [places],
  );

  const selectedPlace = useMemo(() => {
    return places.find((p) => p.id === currentId);
  }, [currentId, places]);

  return (
    <HStack>
      <Select.Root
        collection={collection}
        size="sm"
        value={[currentId]}
        onValueChange={(e) => {
          const p = new URLSearchParams(params);
          p.set("place", e.value[0]);
          router.push("/?" + p.toString());
        }}
      >
        <Select.HiddenSelect />
        <HStack gap={1}>
          <Select.Label>{t("label")}:&nbsp;</Select.Label>
          <Select.Control w="full">
            <Select.Trigger pl={2}>
              <Select.ValueText placeholder="Select place" />
            </Select.Trigger>
            <Select.IndicatorGroup pr={2}>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Drawer.Root
            open={showInfo}
            onOpenChange={(e) => setShowInfo(e.open)}
            placement="bottom"
          >
            <Drawer.Backdrop />
            <Drawer.Trigger>
              <Tooltip
                content={selectedPlace ? "Quick info" : "Select a place first"}
              >
                <IconButton
                  aria-label="Quick info about selected place"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowInfo(!showInfo)}
                  disabled={!selectedPlace}
                >
                  <FiInfo />
                </IconButton>
              </Tooltip>
            </Drawer.Trigger>
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
                <Drawer.Header>
                  <Drawer.Title textAlign="center">Quick info</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body>
                  {selectedPlace ? <PlaceInfo place={selectedPlace} /> : null}
                </Drawer.Body>
              </Drawer.Content>
            </Drawer.Positioner>
          </Drawer.Root>
        </HStack>
        <Portal>
          <Select.Positioner>
            <Select.Content bg="surface">
              {collection.items.map((framework) => (
                <Select.Item
                  item={framework}
                  key={framework.value}
                  p={2}
                  cursor="pointer"
                >
                  {framework.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </HStack>
  );
}

// TODO render infoUrl as website icon
function PlaceInfo({ place }: { place: Place }) {
  return (
    <>
      {place ? (
        <Box p={3}>
          {place.description && (
            <Text as="pre" mb={3}>
              {place.description}
            </Text>
          )}
          <Separator my={3} />
          {/* TODO display as URL icon */}
          {place.location && (
            <Text>
              <b>Location:</b> {place.location}
            </Text>
          )}
        </Box>
      ) : (
        <Text color="gray.500">Select a place to see details.</Text>
      )}
    </>
  );
}
