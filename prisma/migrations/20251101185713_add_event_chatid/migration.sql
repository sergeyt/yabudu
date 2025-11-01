-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('MAX', 'TELEGRAM');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "chatId" TEXT,
ADD COLUMN     "chatType" "ChatType" NOT NULL DEFAULT 'MAX',
ADD COLUMN     "description" TEXT;
