import { Subject, TeacherSubject } from '@prisma/client';
import { Teacher } from '@prisma/client';
import { ITeacherReviewCreateries } from 'src/shared';

export interface ITeacherSubjectExtended extends TeacherSubject {
  subject: Subject
}

export interface ITeacherExtended extends Teacher {
    teacherSubjects: ITeacherSubjectExtended[]
}

export interface ITeacherExtendedResponse {
  id: string;
  fullName: string;
  photo: string;
  subjects: Subject[];
  avgRatings: ITeacherReviewCreateries | null
  countTeacherReviews: number;
}


