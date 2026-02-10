/*
  Warnings:

  - The values [UPDATE,DELETE] on the enum `StoredEventAction` will be removed. If these variants are still used in the database, this will fail.
  - Changed the type of `action` on the `StoredEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StoredEventAction_new" AS ENUM ('CREAR', 'ACTUALIZAR', 'ELIMINAR');
ALTER TABLE "StoredEvent" ALTER COLUMN "action" TYPE "StoredEventAction_new" USING ("action"::text::"StoredEventAction_new");
ALTER TYPE "StoredEventAction" RENAME TO "StoredEventAction_old";
ALTER TYPE "StoredEventAction_new" RENAME TO "StoredEventAction";
DROP TYPE "public"."StoredEventAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "GroupStaff" ADD COLUMN     "predecessorPersonId" INTEGER;

-- AlterTable
ALTER TABLE "StoredEvent" DROP COLUMN "action",
ADD COLUMN     "action" "StoredEventAction" NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "schoolId" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "StoredEvent_entityType_entityId_idx" ON "StoredEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "StoredEvent_action_idx" ON "StoredEvent"("action");

-- CreateIndex
CREATE INDEX "StoredEvent_createdAt_idx" ON "StoredEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "GroupStaff" ADD CONSTRAINT "GroupStaff_predecessorPersonId_fkey" FOREIGN KEY ("predecessorPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
