/*
  Warnings:

  - Added the required column `responsableId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "responsableId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "public"."PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
