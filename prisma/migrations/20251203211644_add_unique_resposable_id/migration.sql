/*
  Warnings:

  - A unique constraint covering the columns `[eventId,trainingModuleId,responsableId]` on the table `EventInstance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EventInstance_eventId_trainingModuleId_key";

-- CreateIndex
CREATE UNIQUE INDEX "EventInstance_eventId_trainingModuleId_responsableId_key" ON "EventInstance"("eventId", "trainingModuleId", "responsableId");
