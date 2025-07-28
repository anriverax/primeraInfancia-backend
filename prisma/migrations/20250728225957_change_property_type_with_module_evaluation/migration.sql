/*
  Warnings:

  - Changed the type of `grade` on the `ModuleEvaluation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ModuleEvaluation" DROP COLUMN "grade",
ADD COLUMN     "grade" DOUBLE PRECISION NOT NULL;
