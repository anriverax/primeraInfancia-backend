/*
  Warnings:

  - Added the required column `valueText` to the `MultipleAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MultipleAnswer" ADD COLUMN     "valueText" TEXT NOT NULL;
