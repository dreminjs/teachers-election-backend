import { User } from '@prisma/client';

export interface IUserRoleResponse extends Pick<User,'role'> {
    userId: string
}
