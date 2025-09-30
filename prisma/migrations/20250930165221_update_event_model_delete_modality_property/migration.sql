/*
  Warnings:

  - You are about to drop the column `modality` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Event" DROP COLUMN "modality";

-- DropEnum
DROP TYPE "public"."Modality";
