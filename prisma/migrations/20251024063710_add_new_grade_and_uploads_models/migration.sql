-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(250),
    "evaluationInstrumentId" INTEGER NOT NULL,
    "evaluationInstrumentDetailId" INTEGER,
    "score" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "numero_evaluacion" INTEGER,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" SERIAL NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "mapping" JSONB NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR(250) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'PENDING',
    "error" TEXT,
    "s3uri" VARCHAR,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_grade_per_student_per_module" ON "Grade"("email", "evaluationInstrumentId", "evaluationInstrumentDetailId", "numero_evaluacion");

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_evaluationInstrumentDetailId_fkey" FOREIGN KEY ("evaluationInstrumentDetailId") REFERENCES "EvaluationInstrumentDetail"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_evaluationInstrumentId_fkey" FOREIGN KEY ("evaluationInstrumentId") REFERENCES "EvaluationInstrument"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
