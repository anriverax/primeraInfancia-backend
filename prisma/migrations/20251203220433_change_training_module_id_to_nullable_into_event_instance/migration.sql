-- DropForeignKey
ALTER TABLE "EventInstance" DROP CONSTRAINT "EventInstance_trainingModuleId_fkey";

-- AlterTable
ALTER TABLE "EventInstance" ALTER COLUMN "trainingModuleId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EventInstance" ADD CONSTRAINT "EventInstance_trainingModuleId_fkey" FOREIGN KEY ("trainingModuleId") REFERENCES "TrainingModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
