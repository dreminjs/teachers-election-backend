import { Type } from 'class-transformer';

export class InfiniteScrollQueryParameters {
  
  @Type(() => Number)
  public cursor: number = 0;

  @Type(() => Number)
  public limit: number = 10;
}
