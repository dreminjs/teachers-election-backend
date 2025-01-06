-- DropForeignKey
ALTER TABLE "TeacherReview" DROP CONSTRAINT "TeacherReview_teacherId_fkey";

-- AddForeignKey
ALTER TABLE "TeacherReview" ADD CONSTRAINT "TeacherReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
