/*
  Warnings:

  - You are about to drop the column `responsableId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `Event` table. All the data in the column will be lost.
  - Made the column `trainingModuleId` on table `EventInstance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `responsableId` on table `EventInstance` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_responsableId_fkey";

-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsableId_fkey";

-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_trainingModuleId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "responsableId",
DROP COLUMN "scheduledDate";

-- AlterTable
ALTER TABLE "EventInstance" ALTER COLUMN "trainingModuleId" SET NOT NULL,
ALTER COLUMN "responsableId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
