/*
  Warnings:

  - You are about to drop the column `supportId` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `EventAttendance` table. All the data in the column will be lost.
  - You are about to drop the `MentorAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TechSupportAssignments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[personId,checkOut]` on the table `AttendanceSession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personId,attendanceSessionId]` on the table `EventAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `personId` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `personId` to the `EventAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceSession" DROP CONSTRAINT "AttendanceSession_supportId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendance" DROP CONSTRAINT "EventAttendance_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_techSupportAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "TechSupportAssignments" DROP CONSTRAINT "TechSupportAssignments_assignedRoleId_fkey";

-- DropForeignKey
ALTER TABLE "TechSupportAssignments" DROP CONSTRAINT "TechSupportAssignments_groupId_fkey";

-- DropForeignKey
ALTER TABLE "TechSupportAssignments" DROP CONSTRAINT "TechSupportAssignments_techSupportId_fkey";

-- DropIndex
DROP INDEX "AttendanceSession_supportId_checkOut_key";

-- DropIndex
DROP INDEX "AttendanceSession_supportId_idx";

-- DropIndex
DROP INDEX "EventAttendance_teacherId_attendanceSessionId_key";

-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "supportId",
ADD COLUMN     "personId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventAttendance" DROP COLUMN "teacherId",
ADD COLUMN     "personId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "MentorAssignment";

-- DropTable
DROP TABLE "TechSupportAssignments";

-- CreateTable
CREATE TABLE "PlannedEvent" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "description" TEXT,
    "plannedDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" INTEGER,

    CONSTRAINT "PlannedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlannedEventTeacher" (
    "id" SERIAL NOT NULL,
    "plannedEventId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,

    CONSTRAINT "PlannedEventTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PlannedEvent_eventId_idx" ON "PlannedEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedEvent_eventId_plannedDate_key" ON "PlannedEvent"("eventId", "plannedDate");

-- CreateIndex
CREATE INDEX "PlannedEventTeacher_plannedEventId_idx" ON "PlannedEventTeacher"("plannedEventId");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedEventTeacher_plannedEventId_personId_key" ON "PlannedEventTeacher"("plannedEventId", "personId");

-- CreateIndex
CREATE INDEX "AttendanceSession_personId_idx" ON "AttendanceSession"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_personId_checkOut_key" ON "AttendanceSession"("personId", "checkOut");

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_personId_attendanceSessionId_key" ON "EventAttendance"("personId", "attendanceSessionId");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedEvent" ADD CONSTRAINT "PlannedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedEvent" ADD CONSTRAINT "PlannedEvent_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedEventTeacher" ADD CONSTRAINT "PlannedEventTeacher_plannedEventId_fkey" FOREIGN KEY ("plannedEventId") REFERENCES "PlannedEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlannedEventTeacher" ADD CONSTRAINT "PlannedEventTeacher_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
