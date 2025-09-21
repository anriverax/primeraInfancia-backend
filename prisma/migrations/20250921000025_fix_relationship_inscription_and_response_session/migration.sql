/*
  Warnings:

  - You are about to drop the column `answerId` on the `ResponseSession` table. All the data in the column will be lost.
  - Added the required column `appendixId` to the `ResponseSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inscriptionId` to the `ResponseSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResponseSession" DROP COLUMN "answerId",
ADD COLUMN     "appendixId" INTEGER NOT NULL,
ADD COLUMN     "inscriptionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ResponseSession" ADD CONSTRAINT "ResponseSession_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseSession" ADD CONSTRAINT "ResponseSession_appendixId_fkey" FOREIGN KEY ("appendixId") REFERENCES "Appendix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
