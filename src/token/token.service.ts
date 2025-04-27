import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ITokens } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma';
import { UserService } from 'src/user';
import { Prisma } from '@prisma/client';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async generateTokens({
    email,
    userId,
  }: {
    email: string;
    userId: string;
  }): Promise<ITokens> {
    try {
      const refreshToken = this.jwtService.sign(
        { email, userId },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        }
      );

      const accessToken = this.jwtService.sign(
        { email, userId },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
          expiresIn: '1d',
        }
      );

      // Сохраняем новый refresh-токен
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          user: { connect: { id: userId } },
        },
      });

      return { accessToken, refreshToken };
    } catch (e) {
      throw new HttpException("user already sign in",HttpStatus.BAD_REQUEST)
    }
  }

  private async saveRefreshToken(
    data: Prisma.RefreshTokenCreateInput
  ): Promise<boolean> {
    await this.prisma.refreshToken.create({
      data,
    });

    return true;
  }

  public async verifyOne({
    token,
    secret,
  }: {
    token: string;
    secret: string;
  }): Promise<string | null> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret,
      });

      return payload;
    } catch (e) {
      return null;
    }
  }

  public decodeToken(token: string): { token: string } {
    return this.jwtService.decode(token);
  }

  public async deleteOne(
    where: Prisma.RefreshTokenWhereUniqueInput
  ): Promise<void> {
    await this.prisma.refreshToken.delete({ where });
  }
}
