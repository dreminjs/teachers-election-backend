import { Subject, Teacher } from '@prisma/client';

export interface ITeacherExtended extends Teacher {
  subject: Subject
  teacherReview: { grade: number }[]
}

export interface ITeacherExtendedResponse  {
  subject: string
  avgRating: number
  teacherReview: undefined
}