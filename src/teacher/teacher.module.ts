import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { PrismaModule } from 'src/prisma';
import { UploadPhotoMiddleware } from './middlewares/upload-teacher-photo.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {
 configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UploadPhotoMiddleware)
      .forRoutes({ path: 'upload', method: RequestMethod.POST });
  }
}
