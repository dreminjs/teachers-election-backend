import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@prisma/client';
import { IUser } from './interfaces/user.interfaces';
import { UserService } from './user.service';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne({ where: { id: id } });
  }

  @Get('me')
  public async info(@CurrentUser() { email, role,nickName }: User): Promise<IUser> {
    return {
      email,
      role,
      nickName
    };
  }
}
