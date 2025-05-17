import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class GetTeacherReviewsQueryParameters {
  @IsOptional()
  teacherId?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isChecked?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  cursor?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  includeComments?: boolean;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minFreebie?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxFreebie?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minFriendliness?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxFriendliness?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minExperienced?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxExperienced?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minStrictness?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxStrictness?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  minSmartless?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  maxSmartless?: number;
}