import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTeacherReviewDto {
  @IsString()
  @IsOptional()
  message: string | null;
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  freebie: number;
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  friendliness: number;
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  experienced: number;
  @IsInt()  
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  strictness: number;
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  smartless: number;
  @IsString()
  teacherId: string;
}
