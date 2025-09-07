-- CreateTable
CREATE TABLE "TrainingModule" (
    "id" SERIAL NOT NULL,
    "moduleName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleReport" (
    "id" SERIAL NOT NULL,
    "moduleScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "ModuleReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingReport" (
    "id" SERIAL NOT NULL,
    "finalScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingEvaluation" (
    "id" SERIAL NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "evaluationInstrumentId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "TrainingEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationInstrument" (
    "id" SERIAL NOT NULL,
    "instrumentName" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "EvaluationInstrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleEvaluation" (
    "id" SERIAL NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "moduleProgressStatus" TEXT NOT NULL,
    "evaluationInstrumentId" INTEGER NOT NULL,
    "inscriptionId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" INTEGER,
    "updatedBy" INTEGER,
    "deletedBy" INTEGER,

    CONSTRAINT "ModuleEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrainingModule_moduleName_key" ON "TrainingModule"("moduleName");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleReport_trainingModuleId_inscriptionId_key" ON "ModuleReport"("trainingModuleId", "inscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_instrumentName_key" ON "EvaluationInstrument"("instrumentName");

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleReport" ADD CONSTRAINT "ModuleReport_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingReport" ADD CONSTRAINT "TrainingReport_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
