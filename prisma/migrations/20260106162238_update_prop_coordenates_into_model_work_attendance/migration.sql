/*
  Warnings:

  - You are about to drop the column `coordinates` on the `WorkAttendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WorkAttendance" DROP COLUMN "coordinates",
ADD COLUMN     "coordenates" TEXT;
