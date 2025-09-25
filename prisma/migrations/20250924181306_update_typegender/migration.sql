/*
  Warnings:

  - The values [F] on the enum `TypeGender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."TypeGender_new" AS ENUM ('M', 'H');
ALTER TABLE "public"."Person" ALTER COLUMN "gender" TYPE "public"."TypeGender_new" USING ("gender"::text::"public"."TypeGender_new");
ALTER TYPE "public"."TypeGender" RENAME TO "TypeGender_old";
ALTER TYPE "public"."TypeGender_new" RENAME TO "TypeGender";
DROP TYPE "public"."TypeGender_old";
COMMIT;
