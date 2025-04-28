import { Type } from "class-transformer";

export class GetTeachersQueryParameters {
  @Type(() => Number)
  cursor?: number;
  @Type(() => Number)
  limit?: number;
  search?: string;
  subjectIds?: string[];
  @Type(() => Number)
  minAvgRating?: number;
  @Type(() => Number)
  maxAvgRating?: number;
  @Type(() => Number)
  minFreebie?: number;
  @Type(() => Number)
  maxFreebie?: number;
  @Type(() => Number)
  minFriendliness?: number;
  @Type(() => Number)
  maxFriendliness?: number;
  @Type(() => Number)
  minExperienced?: number;
  @Type(() => Number)
  maxExperienced?: number;
  @Type(() => Number)
  minStrictness?: number;
  @Type(() => Number)
  maxStrictness?: number;
  @Type(() => Number)
  minSmartless?: number;
  @Type(() => Number)
  maxSmartless?: number;
}
