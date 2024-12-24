import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/';
import { PasswordModule } from 'src/password';
import { TokenModule } from 'src/token';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    PasswordModule,
    TokenModule,
    ConfigModule,
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
  exports: [AccessTokenStrategy],
})
export class AuthModule {}
