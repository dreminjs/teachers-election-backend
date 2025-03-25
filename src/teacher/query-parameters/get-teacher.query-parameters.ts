import { Type } from 'class-transformer';

export class GetTeachersQueryParameters {
  subjectIds?: string[];
  @Type(() => Number)
  minRating?: number; // рейтинг которого нельзя низже выставитьк
  @Type(() => Number)
  maxRating?: number; // рейтинг
  search?: string; // имя учителя
  @Type(() => Number)
  public cursor: number = 0;
  @Type(() => Number)
  public limit: number = 10;
}
