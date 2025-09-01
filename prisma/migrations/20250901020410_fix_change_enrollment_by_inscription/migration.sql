/*
  Warnings:

  - You are about to drop the column `answerId` on the `ResponseSession` table. All the data in the column will be lost.
  - You are about to drop the `Enrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inscriptionId` to the `ResponseSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_personId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentMentor" DROP CONSTRAINT "EnrollmentMentor_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleEvaluation" DROP CONSTRAINT "ModuleEvaluation_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleReport" DROP CONSTRAINT "ModuleReport_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingEvaluation" DROP CONSTRAINT "TrainingEvaluation_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingReport" DROP CONSTRAINT "TrainingReport_enrollmentId_fkey";

-- AlterTable
ALTER TABLE "ResponseSession" DROP COLUMN "answerId",
ADD COLUMN     "inscriptionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Enrollment";

-- CreateTable
CREATE TABLE "Incription" (
    "id" SERIAL NOT NULL,
    "administrativeStatus" TEXT NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "personId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "Incription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incription" ADD CONSTRAINT "Incription_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incription" ADD CONSTRAINT "Incription_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incription" ADD CONSTRAINT "Incription_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentMentor" ADD CONSTRAINT "EnrollmentMentor_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseSession" ADD CONSTRAINT "ResponseSession_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Incription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
