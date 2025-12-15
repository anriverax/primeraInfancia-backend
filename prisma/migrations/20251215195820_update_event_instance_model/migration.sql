/*
  Warnings:

  - You are about to drop the column `scheduledDate` on the `EventInstance` table. All the data in the column will be lost.
  - You are about to drop the column `trainingModuleId` on the `EventInstance` table. All the data in the column will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,responsibleId]` on the table `EventInstance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_personRoleId_fkey";

-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_trainingModuleId_fkey";

-- DropIndex
DROP INDEX "EventInstance_eventId_trainingModuleId_responsibleId_key";

-- DropIndex
DROP INDEX "EventInstance_trainingModuleId_idx";

-- AlterTable
ALTER TABLE "EventInstance" DROP COLUMN "scheduledDate",
DROP COLUMN "trainingModuleId",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER;

-- DropTable
DROP TABLE "Attendance";

-- CreateTable
CREATE TABLE "AttendanceSession" (
    "id" SERIAL NOT NULL,
    "eventInstanceId" INTEGER NOT NULL,
    "modality" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "delegateId" INTEGER NOT NULL,

    CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAttendance" (
    "id" SERIAL NOT NULL,
    "attendanceSessionId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceEnum" NOT NULL,
    "comment" TEXT,
    "justificationFileUrl" TEXT,
    "coordinates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,

    CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkAttendance" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceEnum" NOT NULL DEFAULT 'PRESENTE',
    "comment" TEXT,
    "justificationFile" TEXT,
    "coordinates" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER,

    CONSTRAINT "WorkAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_personId_attendanceSessionId_key" ON "EventAttendance"("personId", "attendanceSessionId");

-- CreateIndex
CREATE INDEX "WorkAttendance_date_idx" ON "WorkAttendance"("date");

-- CreateIndex
CREATE INDEX "WorkAttendance_personId_idx" ON "WorkAttendance"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkAttendance_personId_date_key" ON "WorkAttendance"("personId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "EventInstance_eventId_responsibleId_key" ON "EventInstance"("eventId", "responsibleId");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_attendanceSessionId_fkey" FOREIGN KEY ("attendanceSessionId") REFERENCES "AttendanceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkAttendance" ADD CONSTRAINT "WorkAttendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
