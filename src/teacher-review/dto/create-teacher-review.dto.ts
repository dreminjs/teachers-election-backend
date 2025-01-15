import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateTeacherReviewDto {
  @IsString()
  @IsOptional()
  message: string | null;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  freebie: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  friendliness: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  experienced: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  strictness: number;

  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  smartless: number;

  @IsString()
  teacherId: string;
}
