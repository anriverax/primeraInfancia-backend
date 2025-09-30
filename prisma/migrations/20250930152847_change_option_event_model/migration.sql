/*
  Warnings:

  - Made the column `modality` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Event" ALTER COLUMN "modality" SET NOT NULL;
