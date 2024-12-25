import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { IUserRoleResponse } from './interfaces/user.interfaces';

@Controller('user')
export class UserController {

  

  @Get('role')
  async findUserRole(@CurrentUser() user: User): Promise<IUserRoleResponse> {
    return { role: user.role, userId: user.id };
  }
}
