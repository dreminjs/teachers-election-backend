import { Teacher } from "@prisma/client";



export interface ITeacherExtended extends Teacher {
    subject: string
}