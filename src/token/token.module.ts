import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma';
import { TokenController } from './token.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({ signOptions: { expiresIn: '1d' } }),
    PrismaModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
