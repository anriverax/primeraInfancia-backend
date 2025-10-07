/*
  Warnings:

  - You are about to drop the column `totalHours` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `totalHours` on the `EventType` table. All the data in the column will be lost.
  - Added the required column `defaultHours` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultHours` to the `EventType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "totalHours",
ADD COLUMN     "defaultHours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "EventModule" ADD COLUMN     "assignedHours" INTEGER;

-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "totalHours",
ADD COLUMN     "defaultHours" INTEGER NOT NULL;
