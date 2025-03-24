import { Module } from '@nestjs/common';
import { TeacherReviewController } from './teacher-review.controller';
import { TeacherReviewService } from './teacher-review.service';
import { PrismaModule } from 'src/prisma';
import { LikeModule } from 'src/like/like.module';

@Module({
  imports: [PrismaModule,LikeModule],
  controllers: [TeacherReviewController],
  providers: [TeacherReviewService,],
  exports: [TeacherReviewService]
})
export class TeacherReviewModule {}
