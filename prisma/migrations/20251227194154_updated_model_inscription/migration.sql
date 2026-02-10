/*
  Warnings:

  - You are about to drop the `TrainingBatch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingSlot` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[groupId,teacherId]` on the table `Inscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "TrainingBatch" DROP CONSTRAINT "TrainingBatch_trainerAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSlot" DROP CONSTRAINT "TrainingSlot_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSlot" DROP CONSTRAINT "TrainingSlot_trainingBatchId_fkey";

-- AlterTable
ALTER TABLE "Inscription" ADD COLUMN     "mentorId" INTEGER;

-- DropTable
DROP TABLE "TrainingBatch";

-- DropTable
DROP TABLE "TrainingSlot";

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_groupId_teacherId_key" ON "Inscription"("groupId", "teacherId");

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
