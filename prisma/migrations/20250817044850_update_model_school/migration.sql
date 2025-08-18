/*
  Warnings:

  - You are about to drop the column `createdAt` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `School` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "School" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";
