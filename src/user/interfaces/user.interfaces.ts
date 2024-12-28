import { User } from '@prisma/client';

export interface IUserRoleResponse extends Pick<User,'role'> {
    userId: string
}
export interface IUser extends Omit<User, "id" | "password" | "salt" >{

}