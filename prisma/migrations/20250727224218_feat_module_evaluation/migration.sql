/*
  Warnings:

  - The primary key for the `ModuleReport` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moduleReportId` on the `ModuleReport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ModuleReport" DROP CONSTRAINT "ModuleReport_pkey",
DROP COLUMN "moduleReportId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ModuleReport_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "TrainingReport" (
    "id" SERIAL NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "areaForImprovement" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingEvaluation" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "evaluationInstrumentId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationInstrument" (
    "id" SERIAL NOT NULL,
    "instrumentName" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "EvaluationInstrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleEvaluation" (
    "id" SERIAL NOT NULL,
    "grade" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "moduleProgressStatus" TEXT NOT NULL,
    "evaluationInstrumentId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "ModuleEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_instrumentName_key" ON "EvaluationInstrument"("instrumentName");

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
