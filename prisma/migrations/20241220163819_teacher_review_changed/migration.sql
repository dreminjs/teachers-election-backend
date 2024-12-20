/*
  Warnings:

  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `experienced` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freebie` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `friendliness` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smartless` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `strictness` to the `TeacherReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- AlterTable
ALTER TABLE "TeacherReview" ADD COLUMN     "experienced" INTEGER NOT NULL,
ADD COLUMN     "freebie" INTEGER NOT NULL,
ADD COLUMN     "friendliness" INTEGER NOT NULL,
ADD COLUMN     "smartless" INTEGER NOT NULL,
ADD COLUMN     "strictness" INTEGER NOT NULL,
ALTER COLUMN "message" DROP NOT NULL;

-- DropTable
DROP TABLE "Vote";
