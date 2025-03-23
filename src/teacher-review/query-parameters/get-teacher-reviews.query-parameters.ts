
import { Type } from 'class-transformer';

export class GetTeacherReviewsQueryParameters {
  teacherId: string;
  @Type(() => Boolean)
  isChecked: boolean;
  @Type(() => Number)
  limit: number;
  @Type(() => Number)
  cursor: number;
  @Type(() => Boolean)
  includeComments: boolean
}
