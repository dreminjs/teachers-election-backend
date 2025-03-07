import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/';
import { SignupDto } from './dto/signup.dto';
import { SignupGuard } from './guards/signup.guard';
import { PasswordService } from 'src/password';
import * as bcrypt from 'bcrypt';
import { SigninGuard } from './guards/signin.guard';
import { SigninDto } from './dto/signin.dto';
import { Roles, User } from '@prisma/client';
import { AccessTokenGuard, TokenService } from 'src/token';
import { IAuthResponse } from './interfaces/auth.interfaces';
import { Response } from 'express';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
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

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens({ email, userId });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    return {
      email: body.email,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(SignupGuard)
  @Post('signup')
  async signup(
    @Body() { email, password }: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<IAuthResponse> {
    const salt = await bcrypt.genSalt(6);

    const hashedPassword = await this.passwordService.hashPassword(
      password,
      salt
    );

    const { id: userId } = await this.userService.createOne({
      role: Roles.USER,
      password: hashedPassword,
      email,
      salt,
    });

    const tokens = await this.tokenService.generateTokens({ userId, email });

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
    });

    return {
      email,
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
      message: 'Success',
    };
  }
}
