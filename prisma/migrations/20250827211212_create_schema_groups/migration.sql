/*
  Warnings:

  - You are about to drop the `MentorRegistration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MentorRegistration" DROP CONSTRAINT "MentorRegistration_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MentorRegistration" DROP CONSTRAINT "MentorRegistration_personRoleId_fkey";

-- DropTable
DROP TABLE "public"."MentorRegistration";

-- CreateTable
CREATE TABLE "public"."GroupMentor" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "GroupMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MentorAssignment" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,

    CONSTRAINT "MentorAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GroupMentor" ADD CONSTRAINT "GroupMentor_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMentor" ADD CONSTRAINT "GroupMentor_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."GroupMentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MentorAssignment" ADD CONSTRAINT "MentorAssignment_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "public"."Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
