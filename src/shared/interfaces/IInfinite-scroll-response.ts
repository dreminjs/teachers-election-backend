export interface IInfiniteScrollResponse<T> {
  data: T[];
  nextCursor: number | null;
}
