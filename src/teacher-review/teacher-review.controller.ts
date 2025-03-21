import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherReviewService } from './teacher-review.service';
import { CreateTeacherReviewDto } from './dto/create-teacher-review.dto';
import { AccessTokenGuard } from 'src/token';
import { Roles, Teacher, TeacherReview, User } from '@prisma/client';
import { AllowedRoles, CurrentUser, RolesGuard } from 'src/user';
import { GetTeacherReviewsQueryParameters } from './query-parameters/get-teacher-reviews.query-parameters';
import { IInfiniteScrollResponse } from 'src/shared';

@UseGuards(AccessTokenGuard)
@Controller('teacher-reviews')
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
    @Query()
    { teacherId, isChecked, cursor, limit }: GetTeacherReviewsQueryParameters
  ): Promise<IInfiniteScrollResponse<TeacherReview>> {
    const teachersReviews = await this.teacherReviewService.findMany({
      take: limit,
      skip: cursor,
      where: {
        teacher: { id: teacherId },
        isChecked: isChecked || false,
      },
    });

    const nextCursor = teachersReviews.length < limit ? null : cursor + limit;

    return {
      data: teachersReviews,
      nextCursor,
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherReviewService.deleteOne({ id });
  }

  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/aprove/:id')
  async aprove(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: true }
    );
  }

  @UseGuards(AccessTokenGuard)
  @UseGuards(RolesGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/unaprove/:id')
  async unaprove(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: false }
    );
  }
}
