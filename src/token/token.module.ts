import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma';


@Module({
  imports: [ConfigModule,JwtModule.register({}), PrismaModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
