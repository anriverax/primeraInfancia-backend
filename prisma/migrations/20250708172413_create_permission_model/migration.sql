/*
  Warnings:

  - You are about to drop the column `permissionTypeId` on the `MenuPermission` table. All the data in the column will be lost.
  - You are about to drop the column `menuPermissionId` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PermissionType` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[menuId,permissionId]` on the table `MenuPermission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `permissionId` to the `MenuPermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_parentId_fkey";

-- DropForeignKey
ALTER TABLE "MenuPermission" DROP CONSTRAINT "MenuPermission_menuId_fkey";

-- DropForeignKey
ALTER TABLE "MenuPermission" DROP CONSTRAINT "MenuPermission_permissionTypeId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_menuPermissionId_fkey";

-- DropIndex
DROP INDEX "Department_name_key";

-- DropIndex
DROP INDEX "MenuPermission_menuId_permissionTypeId_key";

-- DropIndex
DROP INDEX "RolePermission_roleId_menuPermissionId_key";

-- AlterTable
ALTER TABLE "MenuPermission" DROP COLUMN "permissionTypeId",
ADD COLUMN     "permissionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "menuPermissionId",
ADD COLUMN     "permissionId" INTEGER;

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "PermissionType";

-- DropEnum
DROP TYPE "TypePermission";

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" INTEGER,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MenuPermission_menuId_permissionId_key" ON "MenuPermission"("menuId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuItem" ADD CONSTRAINT "MenuItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPermission" ADD CONSTRAINT "MenuPermission_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "MenuItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPermission" ADD CONSTRAINT "MenuPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
