/*
  Warnings:

  - The primary key for the `UserKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `UserKey` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserKey" DROP CONSTRAINT "UserKey_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserKey_pkey" PRIMARY KEY ("id");
