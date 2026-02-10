/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `updatedAt` on table `Appendix` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `EventType` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Inscription` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `MentorAssignment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `ModuleEvaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Person` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `PersonRole` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Question` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Section` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `SurveyData` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TechSupportAssignments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TrainingEvaluation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TrainingReport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `TrainingSlot` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- Normalize NULL updatedAt values before adding NOT NULL constraints
UPDATE "Appendix" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Attendance" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Event" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "EventType" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Group" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Inscription" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "MentorAssignment" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "ModuleEvaluation" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Person" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "PersonRole" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Question" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "Section" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "SurveyData" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "TechSupportAssignments" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "TrainingEvaluation" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "TrainingReport" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "TrainingSlot" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
UPDATE "User" SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

-- Add NOT NULL constraints after normalizing data
-- AlterTable
ALTER TABLE "Appendix" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Attendance" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "EventType" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "MentorAssignment" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "ModuleEvaluation" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Person" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "PersonRole" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Section" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "SurveyData" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "TechSupportAssignments" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainingEvaluation" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainingReport" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "TrainingSlot" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;

-- NOTE: We intentionally avoid dropping legacy table "Answer" to prevent data loss.
