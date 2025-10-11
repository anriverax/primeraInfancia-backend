/*
  Warnings:

  - Made the column `options` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "options" SET NOT NULL,
ALTER COLUMN "options" SET DATA TYPE TEXT;
