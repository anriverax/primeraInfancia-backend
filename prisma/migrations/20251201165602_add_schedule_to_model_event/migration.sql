/*
  Warnings:

  - A unique constraint covering the columns `[eventId,trainingModuleId]` on the table `EventModule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "scheduledDate" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "EventModule_eventId_trainingModuleId_key" ON "EventModule"("eventId", "trainingModuleId");
