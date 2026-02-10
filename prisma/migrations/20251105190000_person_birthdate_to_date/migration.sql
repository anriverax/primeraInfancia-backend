-- Safe conversion of Person.birthdate from text to date without data loss
-- Convert common formats: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, YYYY/MM/DD; keep NULL/empty as NULL
ALTER TABLE "Person"
  ALTER COLUMN "birthdate" TYPE DATE USING (
    CASE
      WHEN "birthdate" IS NULL THEN NULL
      WHEN btrim("birthdate") = '' THEN NULL
      WHEN "birthdate" ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN "birthdate"::date
      WHEN "birthdate" ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4}$' THEN to_date("birthdate", 'DD/MM/YYYY')
      WHEN "birthdate" ~ '^[0-9]{2}-[0-9]{2}-[0-9]{4}$' THEN to_date("birthdate", 'DD-MM-YYYY')
      WHEN "birthdate" ~ '^[0-9]{4}/[0-9]{2}/[0-9]{2}$' THEN to_date("birthdate", 'YYYY/MM/DD')
      ELSE NULL
    END
  );
