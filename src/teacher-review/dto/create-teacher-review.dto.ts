import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTeacherReviewDto {
  @IsString()
  @IsOptional()
  message: string | null;
  @IsInt()
  @Type(() => Number)
  freebie: number;
  @IsInt()
  @Type(() => Number)
  friendliness: number;
  @IsInt()
  @Type(() => Number)
  experienced: number;
  @IsInt()
  @Type(() => Number)
  strictness: number;
  @IsInt()
  @Type(() => Number)
  smartless: number;
}
