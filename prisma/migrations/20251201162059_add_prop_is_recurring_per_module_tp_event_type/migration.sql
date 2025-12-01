/*
  Warnings:

  - You are about to drop the column `isRecurringPerModule` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isRecurringPerModule";

-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "isRecurringPerModule" BOOLEAN NOT NULL DEFAULT false;
