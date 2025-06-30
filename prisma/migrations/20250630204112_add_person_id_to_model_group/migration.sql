/*
  Warnings:

  - The values [FORMADOR,MENTOR,TECNICO_APOYO,ESTUDIANTE] on the enum `TypeRole` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `personId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TypeRole_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "Role" ALTER COLUMN "name" TYPE "TypeRole_new" USING ("name"::text::"TypeRole_new");
ALTER TYPE "TypeRole" RENAME TO "TypeRole_old";
ALTER TYPE "TypeRole_new" RENAME TO "TypeRole";
DROP TYPE "TypeRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "personId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GroupMember" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" INTEGER,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" INTEGER;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
