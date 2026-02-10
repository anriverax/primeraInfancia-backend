/*
  Warnings:

  - A unique constraint covering the columns `[eventId,personRoleId,trainingModuleId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trainingModuleId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" ADD COLUMN     "trainingModuleId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isRecurringPerModule" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_personRoleId_trainingModuleId_key" ON "Attendance"("eventId", "personRoleId", "trainingModuleId");

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
