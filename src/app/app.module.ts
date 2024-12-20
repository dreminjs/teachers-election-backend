import { Module } from '@nestjs/common';
import { UserModule } from '../user/';
import { AppController } from '../app/app.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth';
import { PasswordModule } from 'src/password';
import { TeacherModule } from 'src/teacher/';
import { ConfigModule } from '@nestjs/config';
import { TeacherReviewModule } from 'src/teacher-review';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    PasswordModule,
    ConfigModule,
    TeacherModule,
    TeacherReviewModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', "images"),
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
