/*
  Warnings:

  - You are about to drop the column `responseSessionId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the `DetailOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultipleAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseSession` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inscriptionId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `fieldName` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_responseSessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."DetailOption" DROP CONSTRAINT "DetailOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultipleAnswer" DROP CONSTRAINT "MultipleAnswer_answerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MultipleAnswer" DROP CONSTRAINT "MultipleAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResponseSession" DROP CONSTRAINT "ResponseSession_appendixId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ResponseSession" DROP CONSTRAINT "ResponseSession_inscriptionId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "responseSessionId",
ADD COLUMN     "inscriptionId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "fieldName" TEXT NOT NULL,
ADD COLUMN     "options" JSONB,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."DetailOption";

-- DropTable
DROP TABLE "public"."MultipleAnswer";

-- DropTable
DROP TABLE "public"."Option";

-- DropTable
DROP TABLE "public"."ResponseSession";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
