/*
  Warnings:

  - You are about to drop the column `teacherReviewId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `subjectId` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `avgRating` on the `TeacherReview` table. All the data in the column will be lost.
  - You are about to drop the column `isChecked` on the `TeacherReview` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `TeacherReview` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TeacherReview` table. All the data in the column will be lost.
  - You are about to drop the column `nickName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjet_id` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_checked` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacher_id` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_teacherReviewId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherReview" DROP CONSTRAINT "TeacherReview_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "TeacherReview" DROP CONSTRAINT "TeacherReview_userId_fkey";

-- DropIndex
DROP INDEX "RefreshToken_userId_key";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "teacherReviewId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "createdAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "fullName",
DROP COLUMN "subjectId",
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "subjet_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeacherReview" DROP COLUMN "avgRating",
DROP COLUMN "isChecked",
DROP COLUMN "teacherId",
DROP COLUMN "userId",
ADD COLUMN     "avg_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "is_checked" BOOLEAN NOT NULL,
ADD COLUMN     "teacher_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nickName",
ADD COLUMN     "nick_name" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_user_id_key" ON "RefreshToken"("user_id");

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_subjet_id_fkey" FOREIGN KEY ("subjet_id") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherReview" ADD CONSTRAINT "TeacherReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherReview" ADD CONSTRAINT "TeacherReview_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "TeacherReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
