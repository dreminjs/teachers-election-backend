import { Type } from "class-transformer";
import { IsOptional } from "class-validator";

export class IGetSubjectsQueryParameters {

    @Type(() => Number)
    limit: number

    @IsOptional()
    @Type(() => Number)
    cursor?: number
    
    @IsOptional()
    @Type(() => Number)
    page?: number

    title?: string
}