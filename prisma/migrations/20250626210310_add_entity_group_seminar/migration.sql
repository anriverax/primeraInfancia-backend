-- CreateTable
CREATE TABLE "GroupSeminar" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "seminarId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "GroupSeminar_pkey" PRIMARY KEY ("id")
);
