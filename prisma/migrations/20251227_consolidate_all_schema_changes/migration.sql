-- Consolidation of all pending schema changes
-- This migration captures the state of tables and models that were manually synchronized
-- to bring the database into sync with the Prisma schema

-- Drop old Attendance table if it exists and recreate all new attendance tables
DO $$
BEGIN
  -- Ensure AttendanceEnum exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AttendanceEnum') THEN
    CREATE TYPE "AttendanceEnum" AS ENUM ('PRESENTE', 'AUSENTE');
  END IF;
END $$;

-- Create AttendanceSession if missing
CREATE TABLE IF NOT EXISTS "AttendanceSession" (
  "id" SERIAL NOT NULL,
  "eventInstanceId" INTEGER NOT NULL,
  "modality" TEXT NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" INTEGER NOT NULL,
  "delegateId" INTEGER NOT NULL,
  CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AttendanceSession_eventInstanceId_fkey" FOREIGN KEY ("eventInstanceId") REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AttendanceSession_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create EventAttendance if missing
CREATE TABLE IF NOT EXISTS "EventAttendance" (
  "id" SERIAL NOT NULL,
  "attendanceSessionId" INTEGER NOT NULL,
  "personId" INTEGER NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3),
  "status" "AttendanceEnum" NOT NULL,
  "comment" TEXT,
  "justificationFileUrl" TEXT,
  "coordinates" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdBy" INTEGER NOT NULL,
  "updatedBy" INTEGER,
  CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EventAttendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "EventAttendance_attendanceSessionId_fkey" FOREIGN KEY ("attendanceSessionId") REFERENCES "AttendanceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "EventAttendance_personId_attendanceSessionId_key" UNIQUE ("personId", "attendanceSessionId")
);

-- Create WorkAttendance if missing
CREATE TABLE IF NOT EXISTS "WorkAttendance" (
  "id" SERIAL NOT NULL,
  "personId" INTEGER NOT NULL,
  "date" DATE NOT NULL,
  "checkIn" TIMESTAMP(3) NOT NULL,
  "checkOut" TIMESTAMP(3),
  "status" "AttendanceEnum" NOT NULL DEFAULT 'PRESENTE',
  "comment" TEXT,
  "justificationFile" TEXT,
  "coordinates" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "updatedBy" INTEGER,
  CONSTRAINT "WorkAttendance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkAttendance_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "WorkAttendance_personId_date_key" UNIQUE ("personId", "date")
);

CREATE INDEX IF NOT EXISTS "WorkAttendance_date_idx" ON "WorkAttendance"("date");
CREATE INDEX IF NOT EXISTS "WorkAttendance_personId_idx" ON "WorkAttendance"("personId");

-- Drop old Attendance table if it exists
DROP TABLE IF EXISTS "Attendance";

-- Ensure Person has new columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Person' AND column_name='career') THEN
    ALTER TABLE "Person" ADD COLUMN "career" TEXT NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Person' AND column_name='nip') THEN
    ALTER TABLE "Person" ADD COLUMN "nip" INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Person' AND column_name='typePersonId') THEN
    ALTER TABLE "Person" ADD COLUMN "typePersonId" INTEGER NOT NULL DEFAULT 2;
  END IF;
END $$;

-- Ensure EventInstance has new columns and updated FK
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='EventInstance' AND column_name='deletedAt') THEN
    ALTER TABLE "EventInstance" ADD COLUMN "deletedAt" TIMESTAMP(3);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='EventInstance' AND column_name='deletedBy') THEN
    ALTER TABLE "EventInstance" ADD COLUMN "deletedBy" INTEGER;
  END IF;
  -- Drop old columns
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='EventInstance' AND column_name='scheduledDate') THEN
    ALTER TABLE "EventInstance" DROP COLUMN "scheduledDate";
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='EventInstance' AND column_name='trainingModuleId') THEN
    ALTER TABLE "EventInstance" DROP COLUMN "trainingModuleId";
  END IF;
END $$;

-- Ensure Person -> TypePerson FK exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='Person_typePersonId_fkey') THEN
    ALTER TABLE "Person" ADD CONSTRAINT "Person_typePersonId_fkey" FOREIGN KEY ("typePersonId") REFERENCES "TypePerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Ensure EventInstance -> Person FK for responsibleId is correct
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname='EventInstance_responsibleId_fkey' AND contype='f') THEN
    ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsibleId_fkey";
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='EventInstance_responsibleId_fkey') THEN
    ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Ensure EventInstance unique constraint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='EventInstance_eventId_responsibleId_key') THEN
    CREATE UNIQUE INDEX "EventInstance_eventId_responsibleId_key" ON "EventInstance"("eventId", "responsibleId");
  END IF;
END $$;
