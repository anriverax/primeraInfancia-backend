/*
  Warnings:

  - You are about to drop the column `personId` on the `MentorRegistration` table. All the data in the column will be lost.
  - Added the required column `mentorId` to the `MentorRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MentorRegistration" DROP CONSTRAINT "MentorRegistration_personId_fkey";

-- AlterTable
ALTER TABLE "MentorRegistration" DROP COLUMN "personId",
ADD COLUMN     "mentorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "GroupLeader" (
    "id" SERIAL NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "GroupLeader_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupLeader" ADD CONSTRAINT "GroupLeader_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupLeader" ADD CONSTRAINT "GroupLeader_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorRegistration" ADD CONSTRAINT "MentorRegistration_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
