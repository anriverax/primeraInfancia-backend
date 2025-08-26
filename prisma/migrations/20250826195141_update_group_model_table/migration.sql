/*
  Warnings:

  - You are about to drop the column `zoneId` on the `Group` table. All the data in the column will be lost.
  - Added the required column `departmentId` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_zoneId_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "zoneId",
ADD COLUMN     "departmentId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
