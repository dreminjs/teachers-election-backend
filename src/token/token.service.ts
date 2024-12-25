import { Injectable } from '@nestjs/common';
import { ITokens } from './interfaces/tokens.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async generateTokens(email: string): Promise<ITokens> {
    const refreshToken = this.jwtService.sign({ email }, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    const accessToken = this.jwtService.sign({ email }, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: '1d',
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken({
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
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });

      return payload;
    } catch (e) {
      return null;
    }
  }

  public async decodeToken(token: string): Promise<string> {
    return await this.jwtService.decode(token);
  }
}
