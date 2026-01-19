/*
  Warnings:

  - You are about to drop the column `cohortId` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the `EventSchedule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventSchedule" DROP CONSTRAINT "EventSchedule_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventSchedule" DROP CONSTRAINT "EventSchedule_eventTypeId_fkey";

-- DropForeignKey
ALTER TABLE "EventSchedule" DROP CONSTRAINT "EventSchedule_trainingModuleId_fkey";

-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_cohortId_fkey";

-- DropIndex
DROP INDEX "EventType_cohortId_idx";

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "cohortId",
ADD COLUMN     "frequency" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "trainingModuleId" INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE "EventSchedule";

-- CreateIndex
CREATE INDEX "EventType_trainingModuleId_idx" ON "EventType"("trainingModuleId");

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
