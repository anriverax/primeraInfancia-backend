/*
  Warnings:

  - You are about to drop the column `personId` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_personId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "personId";
