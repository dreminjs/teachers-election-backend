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
    @Body() body: CreateTeacherReviewDto
  ): Promise<TeacherReview> {
    return this.teacherReviewService.createOne({
      freebie: body.freebie,
      friendliness: body.friendliness,
      experienced: body.experienced,
      strictness: body.strictness,
      smartless: body.smartless,
      message: body.message,
      user: { connect: { id: userId } },
      isChecked: false,
      grade: body.rating,
      teacher: {
        connect: { id: body.teacherId },
      },
    });
  }

  @Get(':teacherId')
  async findMany(@Param('teacherId') teacherId: string) {
    return await this.teacherReviewService.findMany({
      teacher: { id: teacherId },
      isChecked: false,
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherReviewService.deleteOne({ id });
  }
}
