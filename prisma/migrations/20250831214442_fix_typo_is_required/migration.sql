/*
  Warnings:

  - You are about to drop the column `isRequeried` on the `Question` table. All the data in the column will be lost.
  - Added the required column `isRequired` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "isRequeried",
ADD COLUMN     "isRequired" BOOLEAN NOT NULL;
