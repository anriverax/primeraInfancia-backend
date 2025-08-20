/*
  Warnings:

  - Added the required column `assignedMunicipalityId` to the `PersonRole` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "lastName2" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PersonRole" ADD COLUMN     "assignedMunicipalityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PersonRole" ADD CONSTRAINT "PersonRole_assignedMunicipalityId_fkey" FOREIGN KEY ("assignedMunicipalityId") REFERENCES "Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
