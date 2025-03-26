import { Type } from 'class-transformer';

export class GetTeachersQueryParameters {
  // Фильтрация по предметам
  subjectIds?: string[];

  // Фильтры по общему рейтингу (устаревшие, если нужны только minAvgRating/maxAvgRating, можно удалить)


  // Фильтры по общему среднему рейтингу
  @Type(() => Number)
  minAvgRating?: number;
  @Type(() => Number)
  maxAvgRating?: number;

  // Фильтры для конкретных критериев
  @Type(() => Number)
  minFreebieRating?: number;
  @Type(() => Number)
  maxFreebieRating?: number;

  @Type(() => Number)
  minFriendlinessRating?: number;
  @Type(() => Number)
  maxFriendlinessRating?: number;

  @Type(() => Number)
  minExperiencedRating?: number;
  @Type(() => Number)
  maxExperiencedRating?: number;

  @Type(() => Number)
  minStrictnessRating?: number;
  @Type(() => Number)
  maxStrictnessRating?: number;

  @Type(() => Number)
  minSmartlessRating?: number;
  @Type(() => Number)
  maxSmartlessRating?: number;

  // Фильтрация по имени учителя
  search?: string;

  // Пагинация
  @Type(() => Number)
  public cursor: number = 0;
  @Type(() => Number)
  public limit: number = 10;
}