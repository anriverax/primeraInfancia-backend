-- CreateTable
CREATE TABLE "TrainingModule" (
    "trainingModuleId" SERIAL NOT NULL,
    "moduleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("trainingModuleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingModule_moduleName_key" ON "TrainingModule"("moduleName");
