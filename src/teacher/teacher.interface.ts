import { Subject } from '@prisma/client';
import { Teacher } from '@prisma/client';

export interface ITeacherResponse {
  id: string;
  fullName: string;
  subject: Subject;
  photo: string;
  avgRating: number;
}

export interface ITeacherExtended extends Teacher {
  subject: Subject;
  teacherReview: { grade: number }[];
}

export interface ITeacherExtendedResponse {
  subject: string;
  avgRating: number;
  teacherReview: undefined;
}
