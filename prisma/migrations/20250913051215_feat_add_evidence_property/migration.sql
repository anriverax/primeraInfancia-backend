/*
  Warnings:

  - Added the required column `Evidence` to the `Evidence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Evidence" ADD COLUMN     "Evidence" TEXT NOT NULL;
