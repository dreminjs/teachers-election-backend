import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/';
import { TokenModule } from 'src/token';
import { AccessTokenStrategy } from '../token/strategies/access-token.strategy';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from '../token/guards/access-token.guard';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AccessTokenStrategy,AccessTokenGuard],
  exports: [AccessTokenStrategy],
})
export class AuthModule {}
