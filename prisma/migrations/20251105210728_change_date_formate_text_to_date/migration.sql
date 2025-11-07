-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "createdBy" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Person_districtId_deletedAt_idx" ON "Person"("districtId", "deletedAt");

-- CreateIndex
CREATE INDEX "PersonRole_typePersonId_idx" ON "PersonRole"("typePersonId");
