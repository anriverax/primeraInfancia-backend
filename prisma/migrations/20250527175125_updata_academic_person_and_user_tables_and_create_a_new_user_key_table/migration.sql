/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Academic` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `privateKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_privateKey_key";

-- DropIndex
DROP INDEX "User_publicKey_key";

-- AlterTable
ALTER TABLE "Academic" DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "createdBy";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdBy",
DROP COLUMN "privateKey",
DROP COLUMN "publicKey";

-- CreateTable
CREATE TABLE "UserKey" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserKey" ADD CONSTRAINT "UserKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
