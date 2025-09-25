/*
  Warnings:

  - Added the required column `color` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconName` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodicity` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Appendix` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Appendix" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "iconName" TEXT NOT NULL,
ADD COLUMN     "periodicity" TEXT NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;
