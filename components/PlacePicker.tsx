"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HStack, Field, NativeSelect as Select } from "@chakra-ui/react";

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

  const options = places.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ));

  return (
    <HStack>
      <Field.Label m={0} fontSize="sm">
        Place
      </Field.Label>
      <Select.Root size="sm">
        <Select.Field
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
