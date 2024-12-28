import { Controller, Get, UseGuards } from '@nestjs/common';
import { ITokens } from './interfaces/tokens.interface';
import { TokenService } from './token.service';
import { CurrentUser } from 'src/user';
import { User } from '@prisma/client';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@UseGuards(RefreshTokenGuard)
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  public async index(@CurrentUser() { email }: User): Promise<ITokens> {
    return await this.tokenService.generateTokens(email);
  }
}
