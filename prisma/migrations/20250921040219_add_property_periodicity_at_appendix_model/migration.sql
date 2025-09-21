/*
  Warnings:

  - Added the required column `periodicity` to the `Appendix` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appendix" ADD COLUMN     "periodicity" TEXT NOT NULL;
