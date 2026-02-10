/*
  Warnings:

  - You are about to drop the column `eventId` on the `PlannedEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventInstanceId,plannedDate]` on the table `PlannedEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventInstanceId` to the `PlannedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlannedEvent" DROP CONSTRAINT "PlannedEvent_eventId_fkey";

-- DropIndex
DROP INDEX "PlannedEvent_eventId_idx";

-- DropIndex
DROP INDEX "PlannedEvent_eventId_plannedDate_key";

-- AlterTable
ALTER TABLE "GroupStaff" ADD COLUMN     "createdBy" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "PlannedEvent" DROP COLUMN "eventId",
ADD COLUMN     "eventInstanceId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "PlannedEvent_eventInstanceId_idx" ON "PlannedEvent"("eventInstanceId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedEvent_eventInstanceId_plannedDate_key" ON "PlannedEvent"("eventInstanceId", "plannedDate");

-- AddForeignKey
ALTER TABLE "PlannedEvent" ADD CONSTRAINT "PlannedEvent_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
