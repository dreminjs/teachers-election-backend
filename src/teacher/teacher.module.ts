import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { PrismaModule } from 'src/prisma';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { TeacherReviewModule } from 'src/teacher-review';

@Module({
  imports: [PrismaModule,MinioClientModule,TeacherReviewModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
