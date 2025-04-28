/*
  Warnings:

  - You are about to drop the column `subjectId` on the `teachers_subjects` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `teachers_subjects` table. All the data in the column will be lost.
  - Added the required column `subject_id` to the `teachers_subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `teachers_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "teachers_subjects" DROP CONSTRAINT "teachers_subjects_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "teachers_subjects" DROP CONSTRAINT "teachers_subjects_teacherId_fkey";

-- AlterTable
ALTER TABLE "teachers_subjects" DROP COLUMN "subjectId",
DROP COLUMN "teacherId",
ADD COLUMN     "subject_id" TEXT NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
