/*
  Warnings:

  - You are about to drop the column `cohortId` on the `Inscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mentorId,inscriptionId]` on the table `MentorAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Inscription" DROP CONSTRAINT "Inscription_cohortId_fkey";

-- AlterTable
ALTER TABLE "public"."Inscription" DROP COLUMN "cohortId";

-- CreateIndex
CREATE UNIQUE INDEX "MentorAssignment_mentorId_inscriptionId_key" ON "public"."MentorAssignment"("mentorId", "inscriptionId");
