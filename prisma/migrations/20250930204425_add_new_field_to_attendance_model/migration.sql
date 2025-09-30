/*
  Warnings:

  - Added the required column `modality` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Attendance" ADD COLUMN     "modality" TEXT NOT NULL;
