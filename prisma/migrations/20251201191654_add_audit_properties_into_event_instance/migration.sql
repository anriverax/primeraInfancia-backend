/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `EventType` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `EventInstance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EventInstance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventInstance" ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";
