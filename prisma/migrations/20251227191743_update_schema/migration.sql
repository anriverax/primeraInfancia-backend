/*
  Warnings:

  - You are about to drop the `PersonRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsibleId_fkey";

-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "PersonRole" DROP CONSTRAINT "PersonRole_personId_fkey";

-- DropForeignKey
ALTER TABLE "PersonRole" DROP CONSTRAINT "PersonRole_typePersonId_fkey";

-- DropForeignKey
ALTER TABLE "TechSupportAssignments" DROP CONSTRAINT "TechSupportAssignments_assignedRoleId_fkey";

-- DropForeignKey
ALTER TABLE "TechSupportAssignments" DROP CONSTRAINT "TechSupportAssignments_techSupportId_fkey";

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "career" DROP DEFAULT,
ALTER COLUMN "typePersonId" DROP DEFAULT;

-- DropTable
DROP TABLE "PersonRole";

-- CreateTable
CREATE TABLE "GroupStaff" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GroupStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupStaff_groupId_personId_key" ON "GroupStaff"("groupId", "personId");

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStaff" ADD CONSTRAINT "GroupStaff_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStaff" ADD CONSTRAINT "GroupStaff_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupStaff" ADD CONSTRAINT "GroupStaff_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GroupStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_assignedRoleId_fkey" FOREIGN KEY ("assignedRoleId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_techSupportId_fkey" FOREIGN KEY ("techSupportId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
