import { Subject, Teacher } from '@prisma/client';

export interface ITeacherExtended extends Teacher {
  subject: Subject
}

export interface ITeacherExtendedResponse  {
  subject: string
}