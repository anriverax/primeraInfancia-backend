-- CreateTable
CREATE TABLE "EventSchedule" (
    "id" SERIAL NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "trainingModuleId" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,
    "order" INTEGER,
    "eventId" INTEGER,

    CONSTRAINT "EventSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventSchedule_eventTypeId_trainingModuleId_idx" ON "EventSchedule"("eventTypeId", "trainingModuleId");

-- CreateIndex
CREATE UNIQUE INDEX "EventSchedule_eventTypeId_trainingModuleId_key" ON "EventSchedule"("eventTypeId", "trainingModuleId");

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSchedule" ADD CONSTRAINT "EventSchedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
