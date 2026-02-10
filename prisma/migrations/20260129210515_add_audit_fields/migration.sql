/*
  Warnings:

  - Added the required column `createdBy` to the `PlannedEventTeacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PlannedEventTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PlannedEventTeacher" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" INTEGER;
