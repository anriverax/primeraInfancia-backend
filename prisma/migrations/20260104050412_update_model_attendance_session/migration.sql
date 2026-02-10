/*
  Warnings:

  - You are about to drop the column `coordinates` on the `AttendanceSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AttendanceSession" DROP COLUMN "coordinates",
ADD COLUMN     "coordenates" TEXT;
