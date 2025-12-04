/*
  Warnings:

  - You are about to drop the column `responsableId` on the `EventInstance` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,trainingModuleId,responsibleId]` on the table `EventInstance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `responsibleId` to the `EventInstance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsableId_fkey";

-- DropIndex
DROP INDEX "EventInstance_eventId_trainingModuleId_responsableId_key";

-- AlterTable
ALTER TABLE "EventInstance" DROP COLUMN "responsableId",
ADD COLUMN     "responsibleId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "EventInstance_eventId_trainingModuleId_responsibleId_key" ON "EventInstance"("eventId", "trainingModuleId", "responsibleId");

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
