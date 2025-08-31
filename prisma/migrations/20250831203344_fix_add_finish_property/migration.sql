/*
  Warnings:

  - Added the required column `finish` to the `Tracking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tracking" ADD COLUMN     "finish" TIMESTAMP(3) NOT NULL;
