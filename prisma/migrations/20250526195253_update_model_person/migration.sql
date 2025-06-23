/*
  Warnings:

  - You are about to drop the column `firstName1` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `firstName2` on the `Person` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Academic" ALTER COLUMN "cvImage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "firstName1",
DROP COLUMN "firstName2",
ADD COLUMN     "firstName" TEXT NOT NULL;
