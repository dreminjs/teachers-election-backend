import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  Post,
  Query,
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
    const grades = [
      body.freebie,
      body.experienced,
      body.friendliness,
      body.smartless,
      body.strictness,
    ];

    const averageGrade = grades.reduce((sum, value) => sum + value, 0);

    return this.teacherReviewService.createOne({
      freebie: body.freebie,
      friendliness: body.friendliness,
      experienced: body.experienced,
      strictness: body.strictness,
      smartless: body.smartless,
      message: body.message,
      user: { connect: { id: userId } },
      isChecked: false,
      grade: averageGrade,
      teacher: {
        connect: { id: body.teacherId },
      },
    });
  }

  @Get()
  async findMany(
    @Query('teacherId') teacherId: string,
    @Query('isChecked', ParseBoolPipe) isChecked?: boolean
  ) {
    return await this.teacherReviewService.findMany({
      teacher: { id: teacherId },
      isChecked: isChecked || false,
    });
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherReviewService.deleteOne({ id });
  }
}
