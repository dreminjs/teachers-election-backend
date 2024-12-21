import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AccessTokenGuard } from 'src/auth';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { IUserRoleResponse } from './interfaces/user.interfaces';

@Controller('user')
export class UserController {

  
  @UseGuards(AccessTokenGuard)
  @Get('role')
  async findUserRole(@CurrentUser() user: User): Promise<IUserRoleResponse> {
    return { role: user.role, userId: user.id };
  }
}
