/*
  Warnings:

  - You are about to drop the column `mentorroleid` on the `AppendixTest` table. All the data in the column will be lost.
  - You are about to drop the column `teacherroleid` on the `AppendixTest` table. All the data in the column will be lost.
  - You are about to drop the column `textanswer` on the `AppendixTest` table. All the data in the column will be lost.
  - You are about to drop the column `textquestion` on the `AppendixTest` table. All the data in the column will be lost.
  - Added the required column `mentorRoleId` to the `AppendixTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherRoleId` to the `AppendixTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textAnswer` to the `AppendixTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `textQuestion` to the `AppendixTest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AppendixTest" DROP COLUMN "mentorroleid",
DROP COLUMN "teacherroleid",
DROP COLUMN "textanswer",
DROP COLUMN "textquestion",
ADD COLUMN     "mentorRoleId" INTEGER NOT NULL,
ADD COLUMN     "teacherRoleId" INTEGER NOT NULL,
ADD COLUMN     "textAnswer" TEXT NOT NULL,
ADD COLUMN     "textQuestion" TEXT NOT NULL;
