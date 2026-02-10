/*
  Warnings:

  - You are about to drop the column `personId` on the `PlannedEventTeacher` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[personId,deletedAt]` on the table `GroupStaff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plannedEventId,teacherId]` on the table `PlannedEventTeacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `PlannedEventTeacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlannedEventTeacher" DROP CONSTRAINT "PlannedEventTeacher_personId_fkey";

-- DropIndex
DROP INDEX "GroupStaff_groupId_personId_key";

-- DropIndex
DROP INDEX "PlannedEventTeacher_plannedEventId_personId_key";

-- AlterTable
ALTER TABLE "PlannedEventTeacher" DROP COLUMN "personId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "GroupStaff_groupId_personId_idx" ON "GroupStaff"("groupId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupStaff_personId_deletedAt_key" ON "GroupStaff"("personId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlannedEventTeacher_plannedEventId_teacherId_key" ON "PlannedEventTeacher"("plannedEventId", "teacherId");

-- AddForeignKey
ALTER TABLE "PlannedEventTeacher" ADD CONSTRAINT "PlannedEventTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
