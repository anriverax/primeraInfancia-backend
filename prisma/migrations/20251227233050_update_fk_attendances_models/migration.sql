/*
  Warnings:

  - You are about to drop the column `delegateId` on the `AttendanceSession` table. All the data in the column will be lost.
  - You are about to drop the column `personId` on the `EventAttendance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherId,attendanceSessionId]` on the table `EventAttendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `supportId` to the `AttendanceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `EventAttendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AttendanceSession" DROP CONSTRAINT "AttendanceSession_delegateId_fkey";

-- DropForeignKey
ALTER TABLE "EventAttendance" DROP CONSTRAINT "EventAttendance_personId_fkey";

-- DropIndex (drop constraint, not the index since it's a unique constraint)

-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "delegateId",
ADD COLUMN     "supportId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventAttendance" DROP COLUMN "personId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventAttendance_teacherId_attendanceSessionId_key" ON "EventAttendance"("teacherId", "attendanceSessionId");

-- AddForeignKey
ALTER TABLE "AttendanceSession" ADD CONSTRAINT "AttendanceSession_supportId_fkey" FOREIGN KEY ("supportId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAttendance" ADD CONSTRAINT "EventAttendance_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
