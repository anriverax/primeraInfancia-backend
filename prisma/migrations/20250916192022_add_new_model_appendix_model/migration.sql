-- CreateTable
CREATE TABLE "public"."AppendixTest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "textQuestion" TEXT NOT NULL,
    "textAnswer" TEXT NOT NULL,
    "teacherRoleId" INTEGER NOT NULL,
    "mentorRoleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "AppendixTest_pkey" PRIMARY KEY ("id")
);
