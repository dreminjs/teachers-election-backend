import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetTeacherReviewsQueryParameters {
  @ApiProperty()
  teacherId: string;
  @Type(() => Boolean)
  @ApiProperty()
  isChecked: boolean;
  @Type(() => Number)
  @ApiProperty()
  limit: number;
  @Type(() => Number)
  @ApiProperty()
  cursor: number;
}
