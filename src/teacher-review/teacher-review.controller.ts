import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
    return await this.teacherReviewService.createOne({
      message: body.message,
      experienced: body.experienced,
      friendliness: body.friendliness,
      strictness: body.strictness,
      smartless: body.smartless,
      freebie: body.freebie,
      user: {
        connect: { id: userId },
      },
      isChecked: body?.message ? true : false,
    });
  }

  @Get(":teacherId")
  async findMany(@Param('teacherId') teacherId: string) {
    return await this.teacherReviewService.findMany({
      id: teacherId,
      isChecked: true,
    });
  }
}
