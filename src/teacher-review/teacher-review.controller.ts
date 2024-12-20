import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeacherReviewService } from './teacher-review.service';
import { CreateTeacherReviewDto } from './dto/create-teacher-review.dto';
import { AccessTokenGuard } from 'src/auth';
import { User } from '@prisma/client';
import { CurrentUser } from 'src/user';

@UseGuards(AccessTokenGuard)
@Controller('teacher-review')
export class TeacherReviewController {
  constructor(private readonly teacherReviewService: TeacherReviewService) {}

  @Post()
  async createOne(
    @Body() body: CreateTeacherReviewDto,
    @CurrentUser() { id: userId }: User
  ) {
    return true
  }

  @Get(':teacherId')
  async findMany(@Param('teacherId') teacherId: string) {
    return await this.teacherReviewService.findMany({
      id: teacherId,
      isChecked: true,
    });
  }
}
