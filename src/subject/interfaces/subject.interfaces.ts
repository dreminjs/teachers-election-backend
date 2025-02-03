import { Type } from "class-transformer";


export class IGetSubjectsQueryParameters {
    @Type(() => Number)
    limit: number
    @Type(() => Number)
    page: number
    title?: string
}