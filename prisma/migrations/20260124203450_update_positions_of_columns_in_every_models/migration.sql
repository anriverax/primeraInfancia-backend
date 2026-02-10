/*
  Warnings:

  - You are about to drop the column `responsibleId` on the `EventInstance` table. All the data in the column will be lost.
  - You are about to drop the column `inscriptionId` on the `SurveyData` table. All the data in the column will be lost.
  - You are about to drop the `Inscription` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,personId]` on the table `EventInstance` will be added. If there are existing duplicate values, this will fail.
  - Made the column `personId` on table `EventInstance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teacherId` on table `SurveyData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_personId_fkey";

-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyData" DROP CONSTRAINT "SurveyData_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyData" DROP CONSTRAINT "SurveyData_teacherId_fkey";

-- DropIndex
DROP INDEX "EventInstance_eventId_responsibleId_key";

-- AlterTable
ALTER TABLE "EventInstance" DROP COLUMN "responsibleId",
ALTER COLUMN "personId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "cohortId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SurveyData" DROP COLUMN "inscriptionId",
ALTER COLUMN "trainingModuleId" DROP DEFAULT,
ALTER COLUMN "teacherId" SET NOT NULL;

-- DropTable
DROP TABLE "Inscription";

-- CreateIndex
CREATE UNIQUE INDEX "EventInstance_eventId_personId_key" ON "EventInstance"("eventId", "personId");

-- CreateIndex
CREATE INDEX "Person_dui_deletedAt_idx" ON "Person"("dui", "deletedAt");

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
