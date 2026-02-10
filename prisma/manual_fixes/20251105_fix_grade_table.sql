DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Grade'
  ) THEN
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
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'unique_grade_per_student_per_module'
  ) THEN
    CREATE UNIQUE INDEX "unique_grade_per_student_per_module" ON "Grade"(
      "email", "evaluationInstrumentId", "evaluationInstrumentDetailId", "numero_evaluacion"
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Grade_evaluationInstrumentDetailId_fkey'
  ) THEN
    ALTER TABLE "Grade"
      ADD CONSTRAINT "Grade_evaluationInstrumentDetailId_fkey"
      FOREIGN KEY ("evaluationInstrumentDetailId")
      REFERENCES "EvaluationInstrumentDetail"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Grade_evaluationInstrumentId_fkey'
  ) THEN
    ALTER TABLE "Grade"
      ADD CONSTRAINT "Grade_evaluationInstrumentId_fkey"
      FOREIGN KEY ("evaluationInstrumentId")
      REFERENCES "EvaluationInstrument"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;
END
$$;