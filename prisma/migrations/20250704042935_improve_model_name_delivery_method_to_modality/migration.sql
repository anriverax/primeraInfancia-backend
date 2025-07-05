/*
  Warnings:

  - You are about to drop the column `deliveryMethod` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryMethod` on the `Seminar` table. All the data in the column will be lost.
  - Added the required column `modality` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modality` to the `Seminar` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Modality" AS ENUM ('PRESENCIAL', 'SINCRÓNICO');

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "deliveryMethod",
ADD COLUMN     "modality" "Modality" NOT NULL;

-- AlterTable
ALTER TABLE "Seminar" DROP COLUMN "deliveryMethod",
ADD COLUMN     "modality" "Modality" NOT NULL;

-- DropEnum
DROP TYPE "DeliveryMethod";
