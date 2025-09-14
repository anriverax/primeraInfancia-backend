-- CreateTable
CREATE TABLE "public"."ModuleReport" (
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
CREATE TABLE "public"."TrainingEvaluation" (
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
CREATE TABLE "public"."ModuleEvaluation" (
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

-- CreateTable
CREATE TABLE "public"."EvaluationInstrument" (
    "id" SERIAL NOT NULL,
    "instrumentName" TEXT NOT NULL,
    "periodicity" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EvaluationInstrument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingModule" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TrainingModule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleReport_trainingModuleId_inscriptionId_key" ON "public"."ModuleReport"("trainingModuleId", "inscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationInstrument_instrumentName_key" ON "public"."EvaluationInstrument"("instrumentName");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingModule_name_key" ON "public"."TrainingModule"("name");

-- AddForeignKey
ALTER TABLE "public"."ModuleReport" ADD CONSTRAINT "ModuleReport_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "public"."TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleReport" ADD CONSTRAINT "ModuleReport_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "public"."Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "public"."EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrainingEvaluation" ADD CONSTRAINT "TrainingEvaluation_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "public"."Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "public"."EvaluationInstrument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_inscriptionId_fkey" FOREIGN KEY ("inscriptionId") REFERENCES "public"."Inscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModuleEvaluation" ADD CONSTRAINT "ModuleEvaluation_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "public"."TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
