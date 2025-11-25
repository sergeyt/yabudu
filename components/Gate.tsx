import type { ReactNode } from "react";
import { Center } from "@chakra-ui/react";
import { type User, UserRole } from "@/types/model";

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
