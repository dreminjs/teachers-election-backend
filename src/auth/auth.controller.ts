import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/';
import { SignupDto } from './dto/signup.dto';
import { SignupGuard } from './guards/signup.guard';
import { SigninGuard } from './guards/signin.guard';
import { SigninDto } from './dto/signin.dto';
import { Roles } from '@prisma/client';
import { AccessTokenGuard, TokenService } from 'src/token';
import { IAuthResponse } from './interfaces/auth.interfaces';
import { Response } from 'express';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { hashPassword } from './helpers/password.helpers';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(SigninGuard)
  @Post('signin')
  async signin(
    @Body() body: SigninDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<IAuthResponse> {
    const { email, id: userId } = await this.userService.findOne({
      where: { email: body.email },
    });

    const tokens = await this.tokenService.generateTokens({ email, userId });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path:"/",
      secure: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      path:"/",
      secure: true,
    });

    return {
      email,
      id: userId,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SignupGuard)
  @Post('signup')
  async signup(
    @Body() { email, password, nickName }: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<IAuthResponse> {
    const salt = await bcrypt.genSalt(6);

    const hashedPassword = await hashPassword({ password, salt });

    const { id: userId } = await this.userService.createOne({
      ...(nickName ? { nickName } : {}),
      role: Roles.USER,
      password: hashedPassword,
      email,
      salt,
    });

    const tokens = await this.tokenService.generateTokens({ userId, email });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path:"/",
      secure: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      path:"/",
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    return {
      email,
      id: userId,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  @Delete('signout')
  public async signout(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ message: string }> {
    await this.tokenService.deleteOne({ userId });
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      message: 'You sing out!',
    };
  }
}
