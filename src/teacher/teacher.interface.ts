import { Subject } from '@prisma/client';
import { Teacher } from '@prisma/client';


export interface ITeacherExtended extends Teacher {
  subject: Subject;
  
}

export interface ITeacherExtendedResponse {
  subject: string;
  avgRating: number;
  id: string
  fullName: string
  photo: string
  countTeacherReviews?: number
}
