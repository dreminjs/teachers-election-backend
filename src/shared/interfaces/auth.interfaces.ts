import { User } from "@prisma/client";




export interface IAuthResponse extends Pick<User, "email" | "id"> {}