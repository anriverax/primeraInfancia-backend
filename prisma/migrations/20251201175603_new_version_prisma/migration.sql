/*
  Warnings:

  - You are about to drop the column `eventId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `trainingModuleId` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the `EventModule` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[personRoleId,eventInstanceId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventInstanceId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_trainingModuleId_fkey";

-- DropForeignKey
ALTER TABLE "EventModule" DROP CONSTRAINT "EventModule_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventModule" DROP CONSTRAINT "EventModule_trainingModuleId_fkey";

-- DropIndex
DROP INDEX "Attendance_eventId_personRoleId_trainingModuleId_key";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "eventId",
DROP COLUMN "trainingModuleId",
ADD COLUMN     "eventInstanceId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "EventModule";

-- CreateTable
CREATE TABLE "EventInstance" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER,
    "responsableId" INTEGER,
    "scheduledDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventInstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventInstance_eventId_idx" ON "EventInstance"("eventId");

-- CreateIndex
CREATE INDEX "EventInstance_trainingModuleId_idx" ON "EventInstance"("trainingModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "EventInstance_eventId_trainingModuleId_key" ON "EventInstance"("eventId", "trainingModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_personRoleId_eventInstanceId_key" ON "Attendance"("personRoleId", "eventInstanceId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "PersonRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
