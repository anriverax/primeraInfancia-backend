/*
  Warnings:

  - You are about to drop the column `cohortId` on the `WorkAttendance` table. All the data in the column will be lost.
  - Added the required column `trainingModuleId` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingModuleId` to the `WorkAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkAttendance" DROP CONSTRAINT "WorkAttendance_cohortId_fkey";

-- DropIndex
DROP INDEX "AttendanceSession_cohortId_idx";

-- DropIndex
DROP INDEX "WorkAttendance_cohortId_idx";

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "trainingModuleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SurveyData" ADD COLUMN     "trainingModuleId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "WorkAttendance" DROP COLUMN "cohortId",
ADD COLUMN     "trainingModuleId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "AttendanceSession_cohortId_trainingModuleId_idx" ON "AttendanceSession"("cohortId", "trainingModuleId");

-- CreateIndex
CREATE INDEX "WorkAttendance_trainingModuleId_idx" ON "WorkAttendance"("trainingModuleId");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAttendance" ADD CONSTRAINT "WorkAttendance_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
