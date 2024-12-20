import { Module } from '@nestjs/common';
import { UserModule } from '../user/';
import { AppController } from '../app/app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth';
import { PasswordModule } from 'src/password';

@Module({
  imports: [UserModule, PrismaModule, AuthModule, PasswordModule],
  controllers: [AppController],
})
export class AppModule {}
