/*
  Warnings:

  - A unique constraint covering the columns `[personId,schoolId]` on the table `PrincipalSchool` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PrincipalSchool_personId_schoolId_key" ON "PrincipalSchool"("personId", "schoolId");
