-- DropForeignKey
ALTER TABLE "EnrollmentMentor" DROP CONSTRAINT "EnrollmentMentor_mentorId_fkey";

-- AddForeignKey
ALTER TABLE "EnrollmentMentor" ADD CONSTRAINT "EnrollmentMentor_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "PersonRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
