/*
  Warnings:

  - You are about to drop the `Incription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_responseSessionId_fkey";

-- DropForeignKey
ALTER TABLE "EnrollmentMentor" DROP CONSTRAINT "EnrollmentMentor_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "Incription" DROP CONSTRAINT "Incription_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Incription" DROP CONSTRAINT "Incription_personId_fkey";

-- DropForeignKey
ALTER TABLE "Incription" DROP CONSTRAINT "Incription_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleEvaluation" DROP CONSTRAINT "ModuleEvaluation_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleReport" DROP CONSTRAINT "ModuleReport_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_trackingId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingEvaluation" DROP CONSTRAINT "TrainingEvaluation_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingReport" DROP CONSTRAINT "TrainingReport_enrollmentId_fkey";

-- DropTable
DROP TABLE "Incription";

-- DropTable
DROP TABLE "ResponseSession";

-- CreateTable
CREATE TABLE "Enrollment" (
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

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollmentMentor" ADD CONSTRAINT "EnrollmentMentor_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
