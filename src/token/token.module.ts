import { forwardRef, Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma';
import { TokenController } from './token.controller';
import { UserModule } from 'src/user';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PrismaModule,
    forwardRef(() => UserModule)
  ],
  providers: [TokenService,AccessTokenStrategy,RefreshTokenStrategy],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
