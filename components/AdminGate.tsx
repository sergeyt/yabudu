"use client";

import { ReactNode, useEffect, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { isPlaceAdmin } from "../app/actions";
import { isDefined } from "../lib/util";

export default function AdminGate({
  placeId,
  children,
}: {
  placeId: string;
  children: ReactNode;
}) {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    isPlaceAdmin(placeId)
      .then(setAllowed)
      .catch(() => setAllowed(false));
  }, [placeId]);
  if (!isDefined(allowed))
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );
  if (!allowed) {
    return <Center py={10}>Not authorized</Center>;
  }
  return <>{children}</>;
}
