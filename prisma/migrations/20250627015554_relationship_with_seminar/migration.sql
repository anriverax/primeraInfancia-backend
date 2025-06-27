/*
  Warnings:

  - A unique constraint covering the columns `[groupId,seminarId]` on the table `GroupSeminar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupSeminar_groupId_seminarId_key" ON "GroupSeminar"("groupId", "seminarId");

-- AddForeignKey
ALTER TABLE "GroupSeminar" ADD CONSTRAINT "GroupSeminar_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupSeminar" ADD CONSTRAINT "GroupSeminar_seminarId_fkey" FOREIGN KEY ("seminarId") REFERENCES "Seminar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
