import { DateTime } from "luxon";
import { prisma } from "../lib/prisma";

function startIn(from: Date, hours: number) {
  return DateTime.fromJSDate(from).plus({ hours }).toJSDate();
}

function tomorrowAt(from: Date, at: number) {
  return DateTime.fromJSDate(from)
    .startOf("day")
    .plus({ hours: 24 })
    .set({ hour: at })
    .toJSDate();
}

async function main() {
  const [crnt, ping_pong_house] = await Promise.all([
    prisma.place.upsert({
      where: { name: "Сочи ЦРНТ" },
      create: {
        name: "Сочи ЦРНТ",
        description: "",
        location: "",
        infoUrl: "https://tennis-sochi.ru/",
      },
      update: {},
    }),
    prisma.place.upsert({
      where: { name: "Sochi Ping Pong House" },
      create: {
        name: "Sochi Ping Pong House",
        description: "",
        location: "",
        infoUrl: "https://ping-pong-house.ru/",
      },
      update: {},
    }),
  ]);

  const now = new Date();
  const in36h = startIn(now, 36);
  const in3h = startIn(now, 3);
  const t7pm = tomorrowAt(now, 19);

  // Events with capacities
  await prisma.event.upsert({
    where: { id: "e1" },
    create: {
      id: "e1",
      title: "Лесенка",
      placeId: crnt.id,
      startAt: in36h,
      capacity: 24,
      reserveCapacity: 6,
    },
    update: {
      placeId: crnt.id,
      startAt: in36h,
      capacity: 24,
      reserveCapacity: 6,
    },
  });
  await prisma.event.upsert({
    where: { id: "e2" },
    create: {
      id: "e2",
      title: "Лесенка 200+",
      placeId: ping_pong_house.id,
      startAt: t7pm,
      capacity: 1,
      reserveCapacity: 2,
    },
    update: {
      placeId: ping_pong_house.id,
      startAt: t7pm,
      capacity: 1,
      reserveCapacity: 2,
    },
  });
}

main().then(() => prisma.$disconnect());
