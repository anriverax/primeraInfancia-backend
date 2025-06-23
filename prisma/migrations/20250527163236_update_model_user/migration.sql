/*
  Warnings:

  - You are about to drop the column `privateKey` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[publicKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privateKey]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `privateKey` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicKey` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Person_privateKey_key";

-- DropIndex
DROP INDEX "Person_publicKey_key";

-- AlterTable
ALTER TABLE "Person" DROP COLUMN "privateKey",
DROP COLUMN "publicKey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privateKey" TEXT NOT NULL,
ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_publicKey_key" ON "User"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "User_privateKey_key" ON "User"("privateKey");
