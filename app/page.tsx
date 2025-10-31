import React from "react";
import { Heading, Box, Link } from "@chakra-ui/react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PlacePicker from "@/components/PlacePicker";
import RegisterPanel from "@/components/RegisterPanel";
import SignInButtons from "@/components/SignInButtons";

export default async function Home({
  searchParams,
}: {
  searchParams: { place?: string };
}) {
  const session = await auth();
  const places = await prisma.place.findMany({ orderBy: { name: "asc" } });
  const placeId = searchParams.place ?? places[0]?.id;
  const place = placeId
    ? await prisma.place.findUnique({ where: { id: placeId } })
    : null;
  const event = place
    ? await prisma.event.findFirst({
        where: { placeId: place.id, startAt: { gt: new Date() } },
        orderBy: { startAt: "asc" },
        include: { regs: true },
      })
    : null;

  return (
    <Box as="main" display="grid" gap={4}>
      <Heading as="h1" size="lg">
        Event Registration
      </Heading>
      <PlacePicker places={places} currentId={placeId ?? ""} />
      {!session?.user ? (
        <Box borderWidth="1px" rounded="xl" p={4} bg="white">
          <SignInButtons />
        </Box>
      ) : (
        <RegisterPanel event={event} userId={(session.user as any).id} />
      )}
      <Box fontSize="xs" color="gray.600">
        <Link href="/admin">Admin</Link> ·{" "}
        <Link href="/superadmin/places">Super-admin</Link>
      </Box>
    </Box>
  );
}
