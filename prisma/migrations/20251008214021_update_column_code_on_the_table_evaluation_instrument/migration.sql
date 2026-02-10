/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `EvaluationInstrument` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `EvaluationInstrument` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EvaluationInstrument" ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_code_key" ON "EvaluationInstrument"("code");
