
export class GetTeacherReviewsQueryParameters {
  teacherId?: string;
  isChecked?: boolean;
  cursor?: number;
  limit?: number;
  includeComments?: boolean;

  // Фильтры по рейтингам (min/max)
  minFreebie?: number;
  maxFreebie?: number;
  minFriendliness?: number;
  maxFriendliness?: number;
  minExperienced?: number;
  maxExperienced?: number;
  minStrictness?: number;
  maxStrictness?: number;
  minSmartless?: number;
  maxSmartless?: number;
}