import { TeacherReview, User } from "@prisma/client";



export interface ExtendedTeacherReview extends TeacherReview {
    user: User
}

export interface ExtendedTeacherReviewResponse extends TeacherReview {
    user: {
        id:string
        nickName: string 
    }
    likesCount: number
    userId: undefined
}

