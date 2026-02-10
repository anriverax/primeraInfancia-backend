/*
  Warnings:

  - The primary key for the `MentorAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."MentorAssignment" DROP CONSTRAINT "MentorAssignment_mentorId_fkey";

-- AlterTable
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_pkey",
ADD COLUMN     "techSupportAssignmentId" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ADD CONSTRAINT "MentorAssignment_pkey" PRIMARY KEY ("techSupportAssignmentId");
DROP SEQUENCE "MentorAssignment_id_seq";

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_techSupportAssignmentId_fkey" FOREIGN KEY ("techSupportAssignmentId") REFERENCES "TechSupportAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
