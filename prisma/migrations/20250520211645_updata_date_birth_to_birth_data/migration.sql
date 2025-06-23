/*
  Warnings:

  - Changed the type of `dateBirth` on the `Person` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "dateBirth",
ADD COLUMN     "dateBirth" TIMESTAMP(3) NOT NULL;
