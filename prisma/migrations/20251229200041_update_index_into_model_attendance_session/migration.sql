/*
  Warnings:

  - A unique constraint covering the columns `[supportId,checkOut]` on the table `AttendanceSession` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AttendanceSession_supportId_checkOut_key" ON "AttendanceSession"("supportId", "checkOut");
