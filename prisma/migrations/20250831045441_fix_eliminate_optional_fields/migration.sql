/*
  Warnings:

  - Made the column `valueText` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueNumber` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueBoolean` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueDate` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valueInt` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `textToDisplay` on table `DetailOption` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Instrument` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subTitle` on table `Instrument` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Instrument` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Option` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Option` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionType` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subQuestion` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isMandatory` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `ResponseSession` required. This step will fail if there are existing NULL values in that column.
  - Made the column `answerId` on table `ResponseSession` required. This step will fail if there are existing NULL values in that column.
  - Made the column `trackingId` on table `ResponseSession` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `summary` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderBy` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Tracking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Tracking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start` on table `Tracking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `Tracking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `TrackingType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveryMethod` on table `TrackingType` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ResponseSession" DROP CONSTRAINT "ResponseSession_trackingId_fkey";

-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "valueText" SET NOT NULL,
ALTER COLUMN "valueNumber" SET NOT NULL,
ALTER COLUMN "valueBoolean" SET NOT NULL,
ALTER COLUMN "valueDate" SET NOT NULL,
ALTER COLUMN "valueInt" SET NOT NULL;

-- AlterTable
ALTER TABLE "DetailOption" ALTER COLUMN "textToDisplay" SET NOT NULL;

-- AlterTable
ALTER TABLE "Instrument" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "subTitle" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "text" SET NOT NULL,
ALTER COLUMN "questionType" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "subQuestion" SET NOT NULL,
ALTER COLUMN "isMandatory" SET NOT NULL;

-- AlterTable
ALTER TABLE "ResponseSession" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "answerId" SET NOT NULL,
ALTER COLUMN "trackingId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "summary" SET NOT NULL,
ALTER COLUMN "orderBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tracking" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "start" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrackingType" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "deliveryMethod" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ResponseSession" ADD CONSTRAINT "ResponseSession_trackingId_fkey" FOREIGN KEY ("trackingId") REFERENCES "Tracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
