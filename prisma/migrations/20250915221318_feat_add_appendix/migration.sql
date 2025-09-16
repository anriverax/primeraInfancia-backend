-- CreateTable
CREATE TABLE "Appendix" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "Appendix_pkey" PRIMARY KEY ("id")
);
