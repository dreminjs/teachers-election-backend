import { Module } from '@nestjs/common';
import { UserModule } from '../user/';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth';
import { TeacherModule } from 'src/teacher/';
import { ConfigModule } from '@nestjs/config';
import { TeacherReviewModule } from 'src/teacher-review';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SubjectModule } from 'src/subject';
import { MinioClientModule } from 'src/minio-client/minio-client.module';


@Module({
  imports: [
    SubjectModule,
    UserModule,
    PrismaModule,
    AuthModule,
    ConfigModule,
    TeacherModule,
    TeacherReviewModule,
    MinioClientModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'images'),
    }),
  ],
})
export class AppModule {}
