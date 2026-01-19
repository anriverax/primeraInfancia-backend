/*
  Warnings:

  - You are about to drop the column `frequency` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `trainingModuleId` on the `EventType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_trainingModuleId_fkey";

-- DropIndex
DROP INDEX "EventType_trainingModuleId_idx";

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "frequency",
DROP COLUMN "trainingModuleId";

-- CreateTable
CREATE TABLE "EventSchedule" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventSchedule_eventTypeId_trainingModuleId_idx" ON "EventSchedule"("eventTypeId", "trainingModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSchedule_eventTypeId_trainingModuleId_key" ON "EventSchedule"("eventTypeId", "trainingModuleId");

-- CreateIndex
CREATE INDEX "TrainingModule_cohortId_idx" ON "TrainingModule"("cohortId");

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
