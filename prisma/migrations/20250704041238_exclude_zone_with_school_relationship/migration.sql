/*
  Warnings:

  - You are about to drop the column `zoneId` on the `School` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_zoneId_fkey";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "zoneId";
