/*
  Warnings:

  - You are about to drop the column `dateBirth` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Person" DROP COLUMN "dateBirth",
ADD COLUMN     "birthdate" TIMESTAMP(3);
