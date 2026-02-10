/*
  Warnings:

  - You are about to drop the column `defaultHours` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `assignedHours` on the `EventModule` table. All the data in the column will be lost.
  - You are about to drop the column `defaultHours` on the `EventType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "defaultHours";

-- AlterTable
ALTER TABLE "EventModule" DROP COLUMN "assignedHours";

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "defaultHours";
