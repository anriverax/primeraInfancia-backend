-- CreateEnum
CREATE TYPE "public"."Modality" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "modality" "public"."Modality";
