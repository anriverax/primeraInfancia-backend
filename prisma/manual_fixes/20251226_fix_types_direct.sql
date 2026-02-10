-- Fix column types and NOT NULL constraints
-- Ensure AttendanceEnum type exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'AttendanceEnum'
  ) THEN
    CREATE TYPE "AttendanceEnum" AS ENUM ('PRESENTE', 'AUSENTE');
  END IF;
END $$;

-- Alter WorkAttendance.status - drop default first, then convert
ALTER TABLE "WorkAttendance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "WorkAttendance" ALTER COLUMN "status" TYPE "AttendanceEnum" USING "status"::"AttendanceEnum";
ALTER TABLE "WorkAttendance" ALTER COLUMN "status" SET DEFAULT 'PRESENTE'::"AttendanceEnum";

-- Alter EventAttendance.status to use enum
ALTER TABLE "EventAttendance" ALTER COLUMN "status" TYPE "AttendanceEnum" USING "status"::"AttendanceEnum";

-- Make Person.career NOT NULL with proper default
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Person' AND column_name = 'career' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Person" ALTER COLUMN "career" SET NOT NULL;
  END IF;
END $$;

-- Make Person.typePersonId NOT NULL
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Person' AND column_name = 'typePersonId' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE "Person" ALTER COLUMN "typePersonId" SET NOT NULL;
  END IF;
END $$;
