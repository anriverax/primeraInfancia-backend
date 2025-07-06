/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Municipality` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Department_name_key";

-- DropIndex
DROP INDEX "District_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_name_key" ON "Municipality"("name");
