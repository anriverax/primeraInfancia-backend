-- CreateTable
CREATE TABLE "GroupTrainer" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "trainerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "GroupTrainer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupTrainer" ADD CONSTRAINT "GroupTrainer_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupTrainer" ADD CONSTRAINT "GroupTrainer_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
