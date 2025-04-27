export class GetTeachersQueryParameters {
  cursor?: number;
  limit?: number;
  search?: string;
  subjectIds?: string[];
  minAvgRating?: number;
  maxAvgRating?: number;
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
  sortField?: 'freebie' | 'friendliness' | 'experienced' | 'strictness' | 'smartless' | 'rating';
  sortOrder?: 'asc' | 'desc';
}