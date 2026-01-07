/*
  Warnings:

  - You are about to drop the column `createdAt` on the `WorkAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `WorkAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WorkAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `WorkAttendance` table. All the data in the column will be lost.
  - Made the column `mentorId` on table `Inscription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_mentorId_fkey";

-- DropIndex
DROP INDEX "WorkAttendance_date_idx";

-- DropConstraint
ALTER TABLE "WorkAttendance" DROP CONSTRAINT "WorkAttendance_personId_date_key";

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "mentorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkAttendance" DROP COLUMN "createdAt",
DROP COLUMN "date",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
