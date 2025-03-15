import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTeacherReviewDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string | null;
  @ApiProperty()
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  freebie: number;
  @ApiProperty()
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  friendliness: number;
  @ApiProperty()
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  experienced: number;
  @ApiProperty()
  @IsInt()  
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  strictness: number;
  @ApiProperty()
  @IsInt()
  @MinLength(1)
  @MaxLength(5)
  @Type(() => Number)
  smartless: number;
  @ApiProperty()
  @IsString()
  teacherId: string;
}
