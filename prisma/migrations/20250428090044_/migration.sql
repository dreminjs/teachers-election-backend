/*
  Warnings:

  - You are about to drop the `TeacherSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherSubject" DROP CONSTRAINT "TeacherSubject_teacherId_fkey";

-- DropTable
DROP TABLE "TeacherSubject";

-- CreateTable
CREATE TABLE "teachers_subjects" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,

    CONSTRAINT "teachers_subjects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers_subjects" ADD CONSTRAINT "teachers_subjects_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
