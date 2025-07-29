/*
  Warnings:

  - You are about to drop the column `zoneId` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Zone` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Zone` table. All the data in the column will be lost.
  - Added the required column `zoneId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zone` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "School" DROP CONSTRAINT "School_zoneId_fkey";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "zoneId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "zoneId",
ADD COLUMN     "zone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy";

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
