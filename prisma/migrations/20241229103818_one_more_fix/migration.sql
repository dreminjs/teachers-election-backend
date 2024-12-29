/*
  Warnings:

  - Added the required column `teacherId` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeacherReview" ADD COLUMN     "grade" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TeacherReview" ADD CONSTRAINT "TeacherReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
