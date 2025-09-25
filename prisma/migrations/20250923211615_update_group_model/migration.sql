/*
  Warnings:

  - You are about to drop the column `groupId` on the `TrainingBatch` table. All the data in the column will be lost.
  - You are about to drop the column `trainerId` on the `TrainingBatch` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `TechSupportAssignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainerAssignmentId` to the `TrainingBatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TrainingBatch" DROP CONSTRAINT "TrainingBatch_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainingBatch" DROP CONSTRAINT "TrainingBatch_trainerId_fkey";

-- AlterTable
ALTER TABLE "public"."TechSupportAssignments" ADD COLUMN     "groupId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."TrainingBatch" DROP COLUMN "groupId",
DROP COLUMN "trainerId",
ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "trainerAssignmentId" INTEGER NOT NULL,
ADD COLUMN     "updatedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingBatch" ADD CONSTRAINT "TrainingBatch_trainerAssignmentId_fkey" FOREIGN KEY ("trainerAssignmentId") REFERENCES "public"."TrainerGroupAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
