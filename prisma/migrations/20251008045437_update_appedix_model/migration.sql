/*
  Warnings:

  - Made the column `createdBy` on table `Appendix` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appendix" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;
