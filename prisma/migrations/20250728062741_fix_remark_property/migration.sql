/*
  Warnings:

  - You are about to drop the column `areaForImprovement` on the `TrainingReport` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `TrainingReport` table. All the data in the column will be lost.
  - You are about to drop the column `strength` on the `TrainingReport` table. All the data in the column will be lost.
  - Added the required column `remark` to the `TrainingReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingReport" DROP COLUMN "areaForImprovement",
DROP COLUMN "recommendation",
DROP COLUMN "strength",
ADD COLUMN     "remark" TEXT NOT NULL;
