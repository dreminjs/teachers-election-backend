import { Injectable } from '@nestjs/common';
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
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async generateTokens(email: string): Promise<ITokens> {
    const refreshToken = this.jwtService.sign(
      { email },
      {
        secret: 'REFRESH_TOKEN_SECRET',
        expiresIn: '7d',
      }
    );

    const accessToken = this.jwtService.sign(
      { email },
      {
        secret: 'ACCESS_TOKEN_SECRET',
        expiresIn: '1d',
      }
    );

    const { id: userId } = await this.userService.findOne({ where: { email } });

    await this.saveRefreshToken({ userId, token: refreshToken });

    return { accessToken, refreshToken };
  }

  private async saveRefreshToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }): Promise<boolean> {
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
      },
    });

    return true;
  }

  public async verifyToken(token: string): Promise<string | null> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: 'ACCESS_TOKEN_SECRET',
      });

      return payload;
    } catch (e) {
      return null;
    }
  }

  public async decodeToken(token: string): Promise<string> {
    return await this.jwtService.decode(token);
  }

  public async deleteOne(where: Prisma.RefreshTokenWhereUniqueInput) : Promise<void> {
    await this.prisma.refreshToken.delete({where})
  }

}
