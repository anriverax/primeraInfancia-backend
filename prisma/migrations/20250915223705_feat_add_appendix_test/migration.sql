-- CreateTable
CREATE TABLE "AppendixTest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "textquestion" TEXT NOT NULL,
    "textanswer" TEXT NOT NULL,
    "teacherroleid" INTEGER NOT NULL,
    "mentorroleid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "AppendixTest_pkey" PRIMARY KEY ("id")
);
