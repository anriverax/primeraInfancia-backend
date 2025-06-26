-- CreateTable
CREATE TABLE "PrincipalSchool" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "PrincipalSchool_pkey" PRIMARY KEY ("id")
);
