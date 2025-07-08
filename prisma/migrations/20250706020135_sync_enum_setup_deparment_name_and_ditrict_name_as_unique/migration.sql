/*
  Warnings:

  - The values [Public,Private] on the enum `Sector` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[name]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `typeContentId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Sector_new" AS ENUM ('PÚBLICO', 'PRIVADO');
ALTER TABLE "School" ALTER COLUMN "sector" TYPE "Sector_new" USING ("sector"::text::"Sector_new");
ALTER TYPE "Sector" RENAME TO "Sector_old";
ALTER TYPE "Sector_new" RENAME TO "Sector";
DROP TYPE "Sector_old";
COMMIT;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "typeContentId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "District_name_key" ON "District"("name");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_typeContentId_fkey" FOREIGN KEY ("typeContentId") REFERENCES "TypeContent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
