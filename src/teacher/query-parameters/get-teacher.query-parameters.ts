import { Type } from 'class-transformer';
import { InfiniteScrollQueryParameters } from 'src/shared';

export class GetTeachersQueryParameters {
  subjectIds?: string[];
  thresholdRating?: number; // рейтинг которого нельзя низже выставитьк
  rating?: number; // рейтинг
  search?: string; // имя учителя
  @Type(() => Number)
  public cursor: number = 0;
  @Type(() => Number)
  public limit: number = 10;

}
