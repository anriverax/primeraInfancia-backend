/*
  Warnings:

  - Added the required column `cohortId` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `mentorId` on table `Inscription` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cohortId` to the `WorkAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_mentorId_fkey";

-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "cohortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "mentorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "cohortId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "WorkAttendance" ADD COLUMN     "cohortId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "AttendanceSession_cohortId_idx" ON "AttendanceSession"("cohortId");

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "Event"("eventTypeId");

-- CreateIndex
CREATE INDEX "EventType_cohortId_idx" ON "EventType"("cohortId");

-- CreateIndex
CREATE INDEX "WorkAttendance_cohortId_idx" ON "WorkAttendance"("cohortId");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAttendance" ADD CONSTRAINT "WorkAttendance_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
