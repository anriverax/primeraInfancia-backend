-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_schoolId_fkey";

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "schoolId" SET DEFAULT 1,
ALTER COLUMN "status" DROP DEFAULT;

-- CreateTable
CREATE TABLE "PrincipalSchool" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "PrincipalSchool_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrincipalSchool" ADD CONSTRAINT "PrincipalSchool_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrincipalSchool" ADD CONSTRAINT "PrincipalSchool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
