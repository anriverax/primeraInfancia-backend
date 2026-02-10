/*
  Warnings:

  - You are about to drop the column `inscriptionId` on the `ModuleEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `inscriptionId` on the `ModuleReport` table. All the data in the column will be lost.
  - You are about to drop the column `inscriptionId` on the `TrainingEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `inscriptionId` on the `TrainingReport` table. All the data in the column will be lost.
  - You are about to drop the `UserKey` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[trainingModuleId,teacherId]` on the table `ModuleReport` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `ModuleEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `ModuleReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `TrainingEvaluation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherId` to the `TrainingReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModuleEvaluation" DROP CONSTRAINT "ModuleEvaluation_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleReport" DROP CONSTRAINT "ModuleReport_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingEvaluation" DROP CONSTRAINT "TrainingEvaluation_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingReport" DROP CONSTRAINT "TrainingReport_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "UserKey" DROP CONSTRAINT "UserKey_userId_fkey";

-- DropIndex
DROP INDEX "ModuleReport_trainingModuleId_inscriptionId_key";

-- AlterTable
ALTER TABLE "EventInstance" ADD COLUMN     "personId" INTEGER;

-- AlterTable
ALTER TABLE "ModuleEvaluation" DROP COLUMN "inscriptionId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ModuleReport" DROP COLUMN "inscriptionId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SurveyData" ADD COLUMN     "teacherId" INTEGER;

-- AlterTable
ALTER TABLE "TrainingEvaluation" DROP COLUMN "inscriptionId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TrainingReport" DROP COLUMN "inscriptionId",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserKey";

-- CreateTable
CREATE TABLE "Teacher" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "groupStaffId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_groupStaffId_personId_key" ON "Teacher"("groupStaffId", "personId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleReport_trainingModuleId_teacherId_key" ON "ModuleReport"("trainingModuleId", "teacherId");

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_groupStaffId_fkey" FOREIGN KEY ("groupStaffId") REFERENCES "GroupStaff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
