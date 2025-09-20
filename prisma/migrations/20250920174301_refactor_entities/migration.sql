/*
  Warnings:

  - You are about to drop the column `valueBoolean` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `valueDate` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `valueNumber` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `mentorroleid` on the `Appendix` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Appendix` table. All the data in the column will be lost.
  - You are about to drop the column `teacherroleid` on the `Appendix` table. All the data in the column will be lost.
  - You are about to drop the column `textanswer` on the `Appendix` table. All the data in the column will be lost.
  - You are about to drop the column `textquestion` on the `Appendix` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentId` on the `Section` table. All the data in the column will be lost.
  - You are about to drop the `Instrument` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseSelectionOption` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTitle` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Appendix` table without a default value. This is not possible if the table is not empty.
  - Added the required column `answerId` to the `ResponseSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackingId` to the `ResponseSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appendixId` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResponseSelectionOption" DROP CONSTRAINT "ResponseSelectionOption_answerId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSelectionOption" DROP CONSTRAINT "ResponseSelectionOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "Section" DROP CONSTRAINT "Section_instrumentId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "valueBoolean",
DROP COLUMN "valueDate",
DROP COLUMN "valueNumber";

-- AlterTable
ALTER TABLE "Appendix" DROP COLUMN "mentorroleid",
DROP COLUMN "name",
DROP COLUMN "teacherroleid",
DROP COLUMN "textanswer",
DROP COLUMN "textquestion",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "subTitle" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ResponseSession" ADD COLUMN     "answerId" INTEGER NOT NULL,
ADD COLUMN     "trackingId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Section" DROP COLUMN "instrumentId",
ADD COLUMN     "appendixId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Instrument";

-- DropTable
DROP TABLE "ResponseSelectionOption";

-- CreateTable
CREATE TABLE "MultipleAnswer" (
    "id" SERIAL NOT NULL,
    "answerId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "MultipleAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MultipleAnswer" ADD CONSTRAINT "MultipleAnswer_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultipleAnswer" ADD CONSTRAINT "MultipleAnswer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseSessionId_fkey" FOREIGN KEY ("responseSessionId") REFERENCES "ResponseSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_appendixId_fkey" FOREIGN KEY ("appendixId") REFERENCES "Appendix"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseSession" ADD CONSTRAINT "ResponseSession_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
