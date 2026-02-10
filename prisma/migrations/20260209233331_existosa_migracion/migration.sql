-- DropForeignKey
ALTER TABLE "PrincipalSchool" DROP CONSTRAINT "PrincipalSchool_personId_fkey";

-- DropForeignKey
ALTER TABLE "PrincipalSchool" DROP CONSTRAINT "PrincipalSchool_schoolId_fkey";

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "schoolId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
