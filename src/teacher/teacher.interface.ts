import { Subject, TeacherReview } from '@prisma/client';
import { Teacher } from '@prisma/client';


export interface ITeacherExtended extends Teacher {
  subject: Subject;
  
}

export interface ITeacherExtendedResponse {
  subject: string;
  avgRating: any
  id: string
  fullName: string
  photo: string
  countTeacherReviews?: number
}
