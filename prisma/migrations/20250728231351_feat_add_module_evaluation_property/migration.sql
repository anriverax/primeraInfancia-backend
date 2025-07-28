/*
  Warnings:

  - Added the required column `trainingModuleId` to the `ModuleEvaluation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ModuleEvaluation" ADD COLUMN     "trainingModuleId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
