-- DropForeignKey
ALTER TABLE "Inscription" DROP CONSTRAINT "Inscription_mentorId_fkey";

-- AlterTable
ALTER TABLE "Inscription" ALTER COLUMN "mentorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inscription" ADD CONSTRAINT "Inscription_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "GroupStaff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
