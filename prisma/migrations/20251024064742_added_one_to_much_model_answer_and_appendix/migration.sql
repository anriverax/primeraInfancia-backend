/*
  Warnings:

  - Made the column `appendixId` on table `Answer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "appendixId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_appendixId_fkey" FOREIGN KEY ("appendixId") REFERENCES "Appendix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
