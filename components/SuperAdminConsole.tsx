import type { User, Place } from "@/types/model";
import { Button, VStack } from "@chakra-ui/react";
import { api } from "@/lib/api";
import { SuperAdminGate } from "./Gate";
import { useRouter } from "next/navigation";

type ActionType = "reuse_event";

async function executeAction(type: ActionType, place: Place) {
  await api.places.action(place.id, { type: type });
}

export function SuperAdminConsole({
  user,
  place,
}: {
  user: User;
  place: Place;
}) {
  const router = useRouter();

  const reload = () => {
    // Revalidates data and re-renders the route
    router.refresh();
  };

  const actions = [
    { id: "reuse_event" as ActionType, label: "Reuse Event" },
  ].map(({ id: type, label }) => {
    return (
      <Button
        key={type}
        w="full"
        onClick={async () => {
          await executeAction(type, place);
          reload();
        }}
      >
        {label}
      </Button>
    );
  });
  const renderContent = () => {
    return <VStack>{actions}</VStack>;
  };
  return <SuperAdminGate user={user}>{renderContent()}</SuperAdminGate>;
}
