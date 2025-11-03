"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { HStack, NativeSelect as Select, Text } from "@chakra-ui/react";

type Place = {
  id: string;
  name: string;
};

type Props = {
  places: Place[];
  currentId: string;
};

export default function PlacePicker({ places, currentId }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const t = useTranslations("place_picker");

  const options = places.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ));

  return (
    <HStack>
      <Text m={0} fontSize="sm">
        {t("label")}:&nbsp;
      </Text>
      <Select.Root size="sm">
        <Select.Field
          px={2}
          value={currentId}
          onChange={(e) => {
            const p = new URLSearchParams(params);
            p.set("place", e.target.value);
            router.push("/?" + p.toString());
          }}
        >
          {options}
        </Select.Field>
        <Select.Indicator />
      </Select.Root>
    </HStack>
  );
}
