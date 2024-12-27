import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { IUserRoleResponse } from './interfaces/user.interfaces';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('role')
  async findUserRole(@CurrentUser() user: User): Promise<IUserRoleResponse> {
    return { role: user.role, userId: user.id };
  }

  @Get(':id')
  public async findOne(
    @Query('id') id?: string
  ): Promise<User> {
    return await this.userService.findOne({ where: { id: id } });
  }

  @Get("info")
  public async info(@CurrentUser() user: User): Promise<User> {
    return user;
  }


}
