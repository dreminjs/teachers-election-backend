import { IsString } from 'class-validator';

export class CreateTeacherDto {
  
  @IsString()
  fullName: string;

  @IsString()
  subjectId: string;
}
