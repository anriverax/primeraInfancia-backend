/*
  Warnings:

  - The values [NUEVO] on the enum `TeacherStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `payload` on the `StoredEvent` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StoredEvent` table. All the data in the column will be lost.
  - You are about to drop the `PrincipalSchool` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `action` to the `StoredEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityId` to the `StoredEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `StoredEvent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoredEventAction" AS ENUM ('CREAR', 'UPDATE', 'DELETE');

-- AlterEnum
BEGIN;
CREATE TYPE "TeacherStatus_new" AS ENUM ('ACTUALIZADO', 'CAMBIO_NIVEL', 'JUBILADO', 'RETIRADO', 'INACTIVO', 'ACTIVO', 'NUEVO_INGRESO');
ALTER TABLE "public"."Teacher" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Teacher" ALTER COLUMN "status" TYPE "TeacherStatus_new" USING ("status"::text::"TeacherStatus_new");
ALTER TYPE "TeacherStatus" RENAME TO "TeacherStatus_old";
ALTER TYPE "TeacherStatus_new" RENAME TO "TeacherStatus";
DROP TYPE "public"."TeacherStatus_old";
ALTER TABLE "Teacher" ALTER COLUMN "status" SET DEFAULT 'ACTIVO';
COMMIT;

-- DropForeignKey
ALTER TABLE "PrincipalSchool" DROP CONSTRAINT "PrincipalSchool_personId_fkey";

-- DropForeignKey
ALTER TABLE "PrincipalSchool" DROP CONSTRAINT "PrincipalSchool_schoolId_fkey";

-- AlterTable
ALTER TABLE "StoredEvent" DROP COLUMN "payload",
DROP COLUMN "type",
ADD COLUMN     "action" TEXT NOT NULL,
ADD COLUMN     "entityId" INTEGER NOT NULL,
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "newValues" JSONB,
ADD COLUMN     "oldValues" JSONB,
ALTER COLUMN "createdBy" DROP DEFAULT;

-- DropTable
DROP TABLE "PrincipalSchool";

-- AddForeignKey
ALTER TABLE "StoredEvent" ADD CONSTRAINT "StoredEvent_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
