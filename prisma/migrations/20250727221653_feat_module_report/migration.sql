/*
  Warnings:

  - The primary key for the `TrainingModule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `trainingModuleId` on the `TrainingModule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrainingModule" DROP CONSTRAINT "TrainingModule_pkey",
DROP COLUMN "trainingModuleId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "ModuleReport" (
    "moduleReportId" SERIAL NOT NULL,
    "moduleScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "enrollmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "ModuleReport_pkey" PRIMARY KEY ("moduleReportId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleReport_trainingModuleId_enrollmentId_key" ON "ModuleReport"("trainingModuleId", "enrollmentId");

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
