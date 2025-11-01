import React from "react";
import { Box, Link } from "@chakra-ui/react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PlacePicker from "@/components/PlacePicker";
import RegisterPanel from "@/components/RegisterPanel";
import SignIn from "@/components/SignIn";
import HomePromo from "@/components/HomePromo";

export default async function Home({
  searchParams,
}: {
  searchParams: { place?: string };
}) {
  const session = await auth();
  const user = session?.user;
  const places = await prisma.place.findMany({ orderBy: { name: "asc" } });
  const placeId = searchParams.place ?? places[0]?.id;
  const place = placeId
    ? await prisma.place.findUnique({ where: { id: placeId } })
    : null;
  const upcomingEvent = place
    ? await prisma.event.findFirst({
        where: { placeId: place.id, startAt: { gt: new Date() } },
        orderBy: { startAt: "asc" },
        include: { regs: true },
      })
    : null;

  return (
    <Box as="main" display="grid" gap={4}>
      <HomePromo />
      {user?.id && <PlacePicker places={places} currentId={place?.id ?? ""} />}
      {!user?.id ? (
        <Box p={4}>
          <SignIn />
        </Box>
      ) : (
        <RegisterPanel event={upcomingEvent} userId={user.id} />
      )}
      {user?.id && (
        <Box fontSize="xs" color="gray.600">
          <Link href="/admin">Admin</Link> ·{" "}
          <Link href="/superadmin/places">Super-admin</Link>
        </Box>
      )}
    </Box>
  );
}
