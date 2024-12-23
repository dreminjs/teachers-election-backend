import { Subject } from "@prisma/client";




export interface ISubjectsResponse {
    data: Subject[]
    nextCursor: number | null
}