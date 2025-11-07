/*
  Warnings:

  - You are about to drop the column `chatId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `chatType` on the `Event` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationChannelType" AS ENUM ('TELEGRAM', 'WHATSAPP', 'SLACK', 'MAX', 'EMAIL', 'WEBHOOK');

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "chatId",
DROP COLUMN "chatType";

-- DropEnum
DROP TYPE "ChatType";

-- CreateTable
CREATE TABLE "PlaceNotificationChannel" (
    "id" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "type" "NotificationChannelType" NOT NULL,
    "target" TEXT NOT NULL,
    "meta" JSONB,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaceNotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventNotificationChannel" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" "NotificationChannelType" NOT NULL,
    "target" TEXT NOT NULL,
    "meta" JSONB,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventNotificationChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaceNotificationChannel_placeId_type_target_key" ON "PlaceNotificationChannel"("placeId", "type", "target");

-- CreateIndex
CREATE UNIQUE INDEX "EventNotificationChannel_eventId_type_target_key" ON "EventNotificationChannel"("eventId", "type", "target");

-- AddForeignKey
ALTER TABLE "PlaceNotificationChannel" ADD CONSTRAINT "PlaceNotificationChannel_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventNotificationChannel" ADD CONSTRAINT "EventNotificationChannel_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
