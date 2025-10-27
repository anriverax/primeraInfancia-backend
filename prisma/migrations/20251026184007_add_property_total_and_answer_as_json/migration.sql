-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_appendixId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- AlterTable
ALTER TABLE "Appendix" ADD COLUMN     "total" INTEGER;

-- CreateTable
CREATE TABLE "SurveyData" (
    "id" SERIAL NOT NULL,
    "bash" INTEGER NOT NULL,
    "appendixId" INTEGER NOT NULL,
    "survey" JSONB NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "SurveyData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_appendixId_fkey" FOREIGN KEY ("appendixId") REFERENCES "Appendix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyData" ADD CONSTRAINT "SurveyData_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
