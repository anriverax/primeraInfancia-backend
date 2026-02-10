/*
  Warnings:

  - You are about to drop the column `plannedDate` on the `PlannedEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventInstanceId,start]` on the table `PlannedEvent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `start` to the `PlannedEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlannedEvent_eventInstanceId_plannedDate_key";

-- AlterTable
ALTER TABLE "PlannedEvent" DROP COLUMN "plannedDate",
ADD COLUMN     "start" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PlannedEvent_eventInstanceId_start_key" ON "PlannedEvent"("eventInstanceId", "start");
