"use client";

import { ReactNode, useEffect, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { isSuperAdmin } from "../app/actions";
import { isDefined } from "../lib/util";

export default function SuperAdminGate({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    isSuperAdmin()
      .then(setAllowed)
      .catch(() => setAllowed(false));
  }, []);
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
