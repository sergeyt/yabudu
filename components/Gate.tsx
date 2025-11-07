import { ReactNode, useEffect, useState } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { User, UserRole } from "@/types/model";

// TODO can we fetch auth again here?
export function SuperAdminGate({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const allowed = user.role === UserRole.SUPERADMIN;
  if (!allowed) {
    return (
      <Center py={10}>Not authorized. Please contact application owner.</Center>
    );
  }
  return <>{children}</>;
}
