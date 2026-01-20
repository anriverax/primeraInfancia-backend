/*
  Warnings:

  - You are about to drop the column `cohortId` on the `AttendanceSession` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttendanceSession" DROP CONSTRAINT "AttendanceSession_cohortId_fkey";

-- DropIndex
DROP INDEX "AttendanceSession_cohortId_trainingModuleId_idx";

-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "cohortId";

-- CreateIndex
CREATE INDEX "AttendanceSession_trainingModuleId_idx" ON "AttendanceSession"("trainingModuleId");

-- CreateIndex
CREATE INDEX "AttendanceSession_supportId_idx" ON "AttendanceSession"("supportId");

-- CreateIndex
CREATE INDEX "AttendanceSession_eventInstanceId_idx" ON "AttendanceSession"("eventInstanceId");

-- CreateIndex
CREATE INDEX "AttendanceSession_createdAt_idx" ON "AttendanceSession"("createdAt");
