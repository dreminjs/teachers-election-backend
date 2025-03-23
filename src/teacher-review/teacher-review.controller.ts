import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherReviewService } from './teacher-review.service';
import { CreateTeacherReviewDto } from './dto/create-teacher-review.dto';
import { AccessTokenGuard } from 'src/token';
import { Roles, TeacherReview } from '@prisma/client';
import { AllowedRoles, CurrentUser, RolesGuard } from 'src/user';
import { GetTeacherReviewsQueryParameters } from './query-parameters/get-teacher-reviews.query-parameters';
import { IInfiniteScrollResponse } from 'src/shared';

@UseGuards(AccessTokenGuard)
@Controller('teacher-reviews')
export class TeacherReviewController {
  constructor(private readonly teacherReviewService: TeacherReviewService) {}

  @Post()
  async createOne(
    @CurrentUser("id") userId: string,
    @Body() body: CreateTeacherReviewDto
  ): Promise<TeacherReview> {
    const grades = [
      body.freebie,
      body.experienced,
      body.friendliness,
      body.smartless,
      body.strictness,
    ];

    const sumGrades = grades.reduce((sum, value) => sum + value, 0);

    return this.teacherReviewService.createOne({
      ...body,
      isChecked: false,
      grade: Math.round(sumGrades / 5),
      user: { connect: { id: userId } },
      teacher: {
        connect: { id: body.teacherId },
      },
    });
  }

  @Get()
  async findMany(
    @Query()
    { teacherId, isChecked, cursor, limit, includeComments }: GetTeacherReviewsQueryParameters
  ): Promise<IInfiniteScrollResponse<TeacherReview>> {
    const teachersReviews = await this.teacherReviewService.findMany({
      take: limit,
      skip: cursor,
      where: {
        teacher: { id: teacherId },
        isChecked: isChecked || false,
        ...(includeComments ? { message: { not: null } } : {})
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

  @UseGuards(RolesGuard,AccessTokenGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/approve/:id')
  async approve(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: true }
    );
  }

  @UseGuards(RolesGuard,AccessTokenGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/unapprove/:id')
  async unapprove(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: false }
    );
  }
}
