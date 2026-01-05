/*
  Warnings:

  - You are about to drop the column `coordinates` on the `EventAttendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttendanceSession" ADD COLUMN     "coordinates" TEXT;

-- AlterTable
ALTER TABLE "EventAttendance" DROP COLUMN "coordinates";
