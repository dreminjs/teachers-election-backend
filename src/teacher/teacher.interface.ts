import { Subject, TeacherReview } from '@prisma/client';
import { Teacher } from '@prisma/client';
import { ITeacherReviewCreateries } from 'src/shared';

export interface ITeacherExtended extends Teacher {
  subject: Omit<Subject, 'createdAt'>;
}

export interface ITeacherExtendedResponse {
  subject: string;
  avgRatings: ITeacherReviewCreateries;
  id: string;
  fullName: string;
  photo: string;
  countTeacherReviews?: number;
}
