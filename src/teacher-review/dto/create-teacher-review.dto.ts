import { IsNumber, IsOptional } from 'class-validator';

export class CreateTeacherReviewDto {
  @IsOptional()
  message?: string;
  @IsNumber()
  freebie: number;
  @IsNumber()
  friendliness: number;
  @IsNumber()
  experienced: number;
  @IsNumber()
  strictness: number;
  @IsNumber()
  smartless: number
}
