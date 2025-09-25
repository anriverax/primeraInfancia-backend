/*
  Warnings:

  - You are about to drop the `TrainerGroupAssignments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MentorAssignment" DROP CONSTRAINT "MentorAssignment_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerGroupAssignments" DROP CONSTRAINT "TrainerGroupAssignments_groupId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainerGroupAssignments" DROP CONSTRAINT "TrainerGroupAssignments_trainerAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrainingBatch" DROP CONSTRAINT "TrainingBatch_trainerAssignmentId_fkey";

-- DropTable
DROP TABLE "public"."TrainerGroupAssignments";

-- AddForeignKey
ALTER TABLE "public"."MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."TechSupportAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingBatch" ADD CONSTRAINT "TrainingBatch_trainerAssignmentId_fkey" FOREIGN KEY ("trainerAssignmentId") REFERENCES "public"."TechSupportAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
