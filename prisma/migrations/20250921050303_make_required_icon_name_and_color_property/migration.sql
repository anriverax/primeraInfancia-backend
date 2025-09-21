/*
  Warnings:

  - Made the column `color` on table `Appendix` required. This step will fail if there are existing NULL values in that column.
  - Made the column `iconName` on table `Appendix` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Appendix" ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "iconName" SET NOT NULL;
