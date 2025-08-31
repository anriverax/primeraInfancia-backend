/*
  Warnings:

  - You are about to drop the column `code` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `isMandatory` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `subQuestion` on the `Question` table. All the data in the column will be lost.
  - Added the required column `isRequeried` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderBy` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subSection` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "code",
DROP COLUMN "isMandatory",
DROP COLUMN "subQuestion",
ADD COLUMN     "isRequeried" BOOLEAN NOT NULL,
ADD COLUMN     "orderBy" INTEGER NOT NULL,
ADD COLUMN     "subSection" TEXT NOT NULL;
