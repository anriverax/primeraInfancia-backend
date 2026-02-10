/*
  Warnings:

  - The primary key for the `MentorAssignment` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
CREATE SEQUENCE mentorassignment_id_seq;
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_pkey",
ALTER COLUMN "id" SET DEFAULT nextval('mentorassignment_id_seq'),
ALTER COLUMN "techSupportAssignmentId" DROP DEFAULT,
ADD CONSTRAINT "MentorAssignment_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE mentorassignment_id_seq OWNED BY "MentorAssignment"."id";
DROP SEQUENCE "MentorAssignment_techSupportAssignmentId_seq";
