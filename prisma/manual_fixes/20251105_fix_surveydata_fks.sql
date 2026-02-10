DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SurveyData_appendixId_fkey'
  ) THEN
    ALTER TABLE "SurveyData"
      ADD CONSTRAINT "SurveyData_appendixId_fkey"
      FOREIGN KEY ("appendixId")
      REFERENCES "Appendix"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'SurveyData_inscriptionId_fkey'
  ) THEN
    ALTER TABLE "SurveyData"
      ADD CONSTRAINT "SurveyData_inscriptionId_fkey"
      FOREIGN KEY ("inscriptionId")
      REFERENCES "Inscription"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END
$$;