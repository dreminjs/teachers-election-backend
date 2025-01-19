import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ITokens } from './interfaces/tokens.interface';
import { TokenService } from './token.service';

import { User } from '@prisma/client';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { Response } from 'express';

@UseGuards(RefreshTokenGuard)
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  public async index(@CurrentUser() { email }: User,@Res({passthrough: true}) res: Response): Promise<ITokens> {
  const tokens = await this.tokenService.generateTokens(email);
  
  

  return tokens
  }
}
