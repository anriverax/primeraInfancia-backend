/*
  Warnings:

  - You are about to drop the column `responseSessionId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the `AppendixTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DetailOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Evidence` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MultipleAnswer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackingType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inscriptionId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Appendix` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Question` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_responseSessionId_fkey";

-- DropForeignKey
ALTER TABLE "DetailOption" DROP CONSTRAINT "DetailOption_optionId_fkey";

-- DropForeignKey
ALTER TABLE "Evidence" DROP CONSTRAINT "Evidence_trackingId_fkey";

-- DropForeignKey
ALTER TABLE "MultipleAnswer" DROP CONSTRAINT "MultipleAnswer_answerId_fkey";

-- DropForeignKey
ALTER TABLE "MultipleAnswer" DROP CONSTRAINT "MultipleAnswer_optionId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_appendixId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_inscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_trackingId_fkey";

-- DropForeignKey
ALTER TABLE "Tracking" DROP CONSTRAINT "Tracking_trackingTypeId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "responseSessionId",
ADD COLUMN     "inscriptionId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Appendix" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "options" JSONB,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "AppendixTest";

-- DropTable
DROP TABLE "DetailOption";

-- DropTable
DROP TABLE "Evidence";

-- DropTable
DROP TABLE "MultipleAnswer";

-- DropTable
DROP TABLE "Option";

-- DropTable
DROP TABLE "ResponseSession";

-- DropTable
DROP TABLE "Tracking";

-- DropTable
DROP TABLE "TrackingType";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
