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
  const PLACE_CRNT = {
    name: "ЦРНТ",
    description: "",
    location: "",
    infoUrl: "https://tennis-sochi.ru/",
  };
  const PLACE_PING_PONG_HOUSE = {
    name: "Ping Pong House",
    description: "",
    location: "",
    infoUrl: "https://ping-pong-house.ru/",
  };
  const PLACE_DAGOMYS = {
    name: "Дагомыс Арена",
    description: "",
    location: "",
    infoUrl: "",
  };

  const [crnt, ping_pong_house, dagomys] = await Promise.all([
    prisma.place.upsert({
      where: { name: PLACE_CRNT.name },
      create: PLACE_CRNT,
      update: PLACE_CRNT,
    }),
    prisma.place.upsert({
      where: { name: PLACE_PING_PONG_HOUSE.name },
      create: PLACE_PING_PONG_HOUSE,
      update: {},
    }),
    prisma.place.upsert({
      where: { name: PLACE_DAGOMYS.name },
      create: PLACE_DAGOMYS,
      update: PLACE_DAGOMYS,
    }),
  ]);

  const now = new Date();
  const in36h = startIn(now, 36);
  const in3h = startIn(now, 3);
  const t7pm = tomorrowAt(now, 19);
  const t10am = tomorrowAt(now, 10);

  const game1 = {
    id: "e1",
    title: "Лесенка",
    placeId: crnt.id,
    startAt: t7pm,
    capacity: 24,
    reserveCapacity: 6,
  };
  const game2 = {
    id: "e2",
    title: "Лесенка 200+",
    placeId: ping_pong_house.id,
    startAt: t7pm,
    capacity: 12,
    reserveCapacity: 2,
  };
  const game3 = {
    id: "e3",
    title: "Утреняя Заря",
    placeId: dagomys.id,
    startAt: t10am,
    capacity: 4,
    reserveCapacity: 2,
  };

  // upsert events
  for (const game of [game1, game2, game3]) {
    await prisma.event.upsert({
      where: { id: game.id },
      create: game,
      update: game,
    });
  }
}

main().then(() => prisma.$disconnect());
