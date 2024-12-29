import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeacherReviewService } from './teacher-review.service';
import { CreateTeacherReviewDto } from './dto/create-teacher-review.dto';
import { AccessTokenGuard } from 'src/token';
import { TeacherReview, User } from '@prisma/client';
import { CurrentUser } from 'src/user';

@UseGuards(AccessTokenGuard)
@Controller('teacher-review')
export class TeacherReviewController {
  constructor(private readonly teacherReviewService: TeacherReviewService) {}

  @Post()
  async createOne(
    @CurrentUser() { id: userId }: User,
    @Body() body: CreateTeacherReviewDto,
  ): Promise<TeacherReview> {
    return this.teacherReviewService.createOne({
      ...body,
      user: { connect: { id: userId } },
      isChecked: false,
      teacher: {
        connect: { id: body.teacherId },
      }
    });
  }

  @Get(':teacherId')
  async findMany(@Param('teacherId') teacherId: string) {
    return await this.teacherReviewService.findMany({
      id: teacherId,
      isChecked: true,
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherReviewService.deleteOne({ id });
  }
}
