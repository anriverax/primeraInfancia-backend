/*
  Warnings:

  - You are about to drop the column `comment` on the `EventAttendance` table. All the data in the column will be lost.
  - You are about to drop the column `justificationFileUrl` on the `EventAttendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventAttendance" DROP COLUMN "comment",
DROP COLUMN "justificationFileUrl";

-- CreateTable
CREATE TABLE "AttendanceException" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "justificationFileUrl" TEXT,
    "absenceClassificationId" INTEGER NOT NULL,
    "eventAttendanceId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,

    CONSTRAINT "AttendanceException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceException_eventAttendanceId_absenceClassification_key" ON "AttendanceException"("eventAttendanceId", "absenceClassificationId");

-- AddForeignKey
ALTER TABLE "AttendanceException" ADD CONSTRAINT "AttendanceException_absenceClassificationId_fkey" FOREIGN KEY ("absenceClassificationId") REFERENCES "AbsenceClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceException" ADD CONSTRAINT "AttendanceException_eventAttendanceId_fkey" FOREIGN KEY ("eventAttendanceId") REFERENCES "EventAttendance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
