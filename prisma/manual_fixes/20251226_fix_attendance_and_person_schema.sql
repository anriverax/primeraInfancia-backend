DO $$
BEGIN
  -- Add missing columns to Person table
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Person' AND column_name = 'career'
  ) THEN
    ALTER TABLE "Person" ADD COLUMN "career" TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Person' AND column_name = 'nip'
  ) THEN
    ALTER TABLE "Person" ADD COLUMN "nip" INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Person' AND column_name = 'typePersonId'
  ) THEN
    ALTER TABLE "Person" ADD COLUMN "typePersonId" INTEGER DEFAULT 2;
  END IF;

  -- Add foreign key for typePersonId
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Person_typePersonId_fkey'
  ) THEN
    ALTER TABLE "Person"
      ADD CONSTRAINT "Person_typePersonId_fkey"
      FOREIGN KEY ("typePersonId")
      REFERENCES "TypePerson"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;
  END IF;

  -- Create AttendanceSession table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'AttendanceSession'
  ) THEN
    CREATE TABLE "AttendanceSession" (
      "id" SERIAL NOT NULL,
      "eventInstanceId" INTEGER NOT NULL,
      "modality" TEXT NOT NULL,
      "checkIn" TIMESTAMP(3) NOT NULL,
      "checkOut" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdBy" INTEGER NOT NULL,
      "delegateId" INTEGER NOT NULL,
      CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
    );
  END IF;

  -- Add foreign keys for AttendanceSession if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AttendanceSession_eventInstanceId_fkey'
  ) THEN
    ALTER TABLE "AttendanceSession"
      ADD CONSTRAINT "AttendanceSession_eventInstanceId_fkey"
      FOREIGN KEY ("eventInstanceId")
      REFERENCES "EventInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AttendanceSession_delegateId_fkey'
  ) THEN
    ALTER TABLE "AttendanceSession"
      ADD CONSTRAINT "AttendanceSession_delegateId_fkey"
      FOREIGN KEY ("delegateId")
      REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  -- Create EventAttendance table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'EventAttendance'
  ) THEN
    CREATE TABLE "EventAttendance" (
      "id" SERIAL NOT NULL,
      "attendanceSessionId" INTEGER NOT NULL,
      "personId" INTEGER NOT NULL,
      "checkIn" TIMESTAMP(3) NOT NULL,
      "checkOut" TIMESTAMP(3),
      "status" TEXT NOT NULL,
      "comment" TEXT,
      "justificationFileUrl" TEXT,
      "coordinates" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "createdBy" INTEGER NOT NULL,
      "updatedBy" INTEGER,
      CONSTRAINT "EventAttendance_pkey" PRIMARY KEY ("id")
    );
  END IF;

  -- Add unique index for EventAttendance if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'EventAttendance_personId_attendanceSessionId_key'
  ) THEN
    CREATE UNIQUE INDEX "EventAttendance_personId_attendanceSessionId_key" ON "EventAttendance"("personId", "attendanceSessionId");
  END IF;

  -- Add foreign keys for EventAttendance if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EventAttendance_personId_fkey'
  ) THEN
    ALTER TABLE "EventAttendance"
      ADD CONSTRAINT "EventAttendance_personId_fkey"
      FOREIGN KEY ("personId")
      REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EventAttendance_attendanceSessionId_fkey'
  ) THEN
    ALTER TABLE "EventAttendance"
      ADD CONSTRAINT "EventAttendance_attendanceSessionId_fkey"
      FOREIGN KEY ("attendanceSessionId")
      REFERENCES "AttendanceSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  -- Create WorkAttendance table if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'WorkAttendance'
  ) THEN
    CREATE TABLE "WorkAttendance" (
      "id" SERIAL NOT NULL,
      "personId" INTEGER NOT NULL,
      "date" DATE NOT NULL,
      "checkIn" TIMESTAMP(3) NOT NULL,
      "checkOut" TIMESTAMP(3),
      "status" TEXT NOT NULL DEFAULT 'PRESENTE',
      "comment" TEXT,
      "justificationFile" TEXT,
      "coordinates" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      "updatedBy" INTEGER,
      CONSTRAINT "WorkAttendance_pkey" PRIMARY KEY ("id")
    );
  END IF;

  -- Add unique index for WorkAttendance if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'WorkAttendance_personId_date_key'
  ) THEN
    CREATE UNIQUE INDEX "WorkAttendance_personId_date_key" ON "WorkAttendance"("personId", "date");
  END IF;

  -- Add indexes for WorkAttendance if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'WorkAttendance_date_idx'
  ) THEN
    CREATE INDEX "WorkAttendance_date_idx" ON "WorkAttendance"("date");
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'WorkAttendance_personId_idx'
  ) THEN
    CREATE INDEX "WorkAttendance_personId_idx" ON "WorkAttendance"("personId");
  END IF;

  -- Add foreign key for WorkAttendance if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'WorkAttendance_personId_fkey'
  ) THEN
    ALTER TABLE "WorkAttendance"
      ADD CONSTRAINT "WorkAttendance_personId_fkey"
      FOREIGN KEY ("personId")
      REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  -- Update EventInstance to make responsibleId nullable
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EventInstance_responsibleId_fkey'
  ) THEN
    ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_responsibleId_fkey";
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EventInstance_responsibleId_fkey'
  ) THEN
    ALTER TABLE "EventInstance"
      ADD CONSTRAINT "EventInstance_responsibleId_fkey"
      FOREIGN KEY ("responsibleId")
      REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  -- Add unique index for EventInstance if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'EventInstance_eventId_responsibleId_key'
  ) THEN
    CREATE UNIQUE INDEX "EventInstance_eventId_responsibleId_key" ON "EventInstance"("eventId", "responsibleId");
  END IF;

  -- Drop old Attendance table if it exists
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'Attendance'
  ) THEN
    DROP TABLE IF EXISTS "Attendance" CASCADE;
  END IF;

END $$;
