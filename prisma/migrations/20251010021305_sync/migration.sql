/*
  Warnings:

  - The values [F] on the enum `TypeGender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `instrumentName` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `EvaluationInstrument` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `ModuleEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `moduleProgressStatus` on the `ModuleEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `duiImage` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `PersonRole` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `PrincipalSchool` table. All the data in the column will be lost.
  - You are about to drop the column `sector` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `TrainingEvaluation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `deletedBy` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `moduleName` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `TrainingModule` table. All the data in the column will be lost.
  - You are about to drop the column `remark` on the `TrainingReport` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Academic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupLeader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupMentor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GroupSeminar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seminar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TypeContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkAssignment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `EvaluationInstrument` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `EvaluationInstrument` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mentorId,inscriptionId]` on the table `MentorAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[personId,typePersonId]` on the table `PersonRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `modality` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Made the column `eventId` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `personRoleId` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `checkIn` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Attendance` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `code` to the `EvaluationInstrument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `EvaluationInstrument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responsableId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cohortId` to the `EventType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `EventType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cohortId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `Group` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `Inscription` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdBy` to the `MentorAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `techSupportAssignmentId` to the `MentorAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `MenuItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `ModuleEvaluation` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `attendancePercentage` to the `ModuleReport` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `status` on the `ModuleReport` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `career` to the `PersonRole` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `name` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `permissionId` on table `RolePermission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `cohortId` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cohortId` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hours` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `TrainingModule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attendancePercentage` to the `TrainingReport` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdBy` on table `TrainingReport` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMIN', 'USER', 'USER_FORMADOR', 'USER_MENTOR', 'USER_TECNICO_APOYO', 'USER_DOCENTE', 'USER_DIRECTOR');

-- CreateEnum
CREATE TYPE "AttendanceEnum" AS ENUM ('PRESENTE', 'AUSENTE');

-- CreateEnum
CREATE TYPE "EvaluationEnum" AS ENUM ('APROBADO', 'REPROBADO');

-- AlterEnum
BEGIN;
CREATE TYPE "TypeGender_new" AS ENUM ('M', 'H');
ALTER TABLE "Person" ALTER COLUMN "gender" TYPE "TypeGender_new" USING ("gender"::text::"TypeGender_new");
ALTER TYPE "TypeGender" RENAME TO "TypeGender_old";
ALTER TYPE "TypeGender_new" RENAME TO "TypeGender";
DROP TYPE "TypeGender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Academic" DROP CONSTRAINT "Academic_personId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_personRoleId_fkey";

-- DropForeignKey
ALTER TABLE "GroupLeader" DROP CONSTRAINT "GroupLeader_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupLeader" DROP CONSTRAINT "GroupLeader_trainerId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMentor" DROP CONSTRAINT "GroupMentor_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMentor" DROP CONSTRAINT "GroupMentor_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "GroupSeminar" DROP CONSTRAINT "GroupSeminar_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupSeminar" DROP CONSTRAINT "GroupSeminar_seminarId_fkey";

-- DropForeignKey
ALTER TABLE "MentorAssignment" DROP CONSTRAINT "MentorAssignment_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "WorkAssignment" DROP CONSTRAINT "WorkAssignment_assignedMunicipalityId_fkey";

-- DropForeignKey
ALTER TABLE "WorkAssignment" DROP CONSTRAINT "WorkAssignment_personId_fkey";

-- DropIndex
DROP INDEX "EvaluationInstrument_instrumentName_key";

-- DropIndex
DROP INDEX "TrainingModule_moduleName_key";

-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "coordenates" TEXT,
ADD COLUMN     "justificationUrl" TEXT,
ADD COLUMN     "modality" TEXT NOT NULL,
ADD COLUMN     "status" "AttendanceEnum" NOT NULL,
ALTER COLUMN "eventId" SET NOT NULL,
ALTER COLUMN "personRoleId" SET NOT NULL,
ALTER COLUMN "checkIn" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "EvaluationInstrument" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "instrumentName",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "responsableId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "cohortId" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "cohortId" INTEGER NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "MentorAssignment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "techSupportAssignmentId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" INTEGER;

-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "order" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ModuleEvaluation" DROP COLUMN "comment",
DROP COLUMN "moduleProgressStatus",
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "ModuleReport" ADD COLUMN     "attendancePercentage" DOUBLE PRECISION NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EvaluationEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "duiImage",
DROP COLUMN "isActive",
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PersonRole" DROP COLUMN "createdBy",
ADD COLUMN     "career" TEXT NOT NULL,
ADD COLUMN     "nip" INTEGER,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PrincipalSchool" DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "name",
ADD COLUMN     "name" "RoleType" NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "permissionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "sector",
ADD COLUMN     "cohortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TrainingEvaluation" DROP COLUMN "comment",
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TrainingModule" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "deletedAt",
DROP COLUMN "deletedBy",
DROP COLUMN "moduleName",
DROP COLUMN "updatedAt",
DROP COLUMN "updatedBy",
ADD COLUMN     "cohortId" INTEGER NOT NULL,
ADD COLUMN     "endDate" DATE NOT NULL,
ADD COLUMN     "hours" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "startDate" DATE NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TrainingReport" DROP COLUMN "remark",
ADD COLUMN     "attendancePercentage" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isActive",
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "Academic";

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "GroupLeader";

-- DropTable
DROP TABLE "GroupMentor";

-- DropTable
DROP TABLE "GroupSeminar";

-- DropTable
DROP TABLE "Seminar";

-- DropTable
DROP TABLE "TypeContent";

-- DropTable
DROP TABLE "Unit";

-- DropTable
DROP TABLE "WorkAssignment";

-- DropEnum
DROP TYPE "DeliveryMethod";

-- DropEnum
DROP TYPE "TypeRole";

-- CreateTable
CREATE TABLE "Cohort" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechSupportAssignments" (
    "id" SERIAL NOT NULL,
    "techSupportId" INTEGER NOT NULL,
    "assignedRoleId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TechSupportAssignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingBatch" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "trainerAssignmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,
    "updatedBy" INTEGER,

    CONSTRAINT "TrainingBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSlot" (
    "id" SERIAL NOT NULL,
    "trainingBatchId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventModule" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,

    CONSTRAINT "EventModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationInstrumentDetail" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "evaluationInstrumentId" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "moduleNumber" INTEGER,

    CONSTRAINT "EvaluationInstrumentDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_code_key" ON "EvaluationInstrument"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_name_key" ON "EvaluationInstrument"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MentorAssignment_mentorId_inscriptionId_key" ON "MentorAssignment"("mentorId", "inscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "PersonRole_personId_typePersonId_key" ON "PersonRole"("personId", "typePersonId");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_techSupportId_fkey" FOREIGN KEY ("techSupportId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechSupportAssignments" ADD CONSTRAINT "TechSupportAssignments_assignedRoleId_fkey" FOREIGN KEY ("assignedRoleId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_techSupportAssignmentId_fkey" FOREIGN KEY ("techSupportAssignmentId") REFERENCES "TechSupportAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorAssignment" ADD CONSTRAINT "MentorAssignment_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingBatch" ADD CONSTRAINT "TrainingBatch_trainerAssignmentId_fkey" FOREIGN KEY ("trainerAssignmentId") REFERENCES "TechSupportAssignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSlot" ADD CONSTRAINT "TrainingSlot_trainingBatchId_fkey" FOREIGN KEY ("trainingBatchId") REFERENCES "TrainingBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSlot" ADD CONSTRAINT "TrainingSlot_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_personRoleId_fkey" FOREIGN KEY ("personRoleId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventModule" ADD CONSTRAINT "EventModule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventModule" ADD CONSTRAINT "EventModule_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingModule" ADD CONSTRAINT "TrainingModule_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationInstrumentDetail" ADD CONSTRAINT "EvaluationInstrumentDetail_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
