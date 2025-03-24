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
import { Like, Roles, TeacherReview } from '@prisma/client';
import { AllowedRoles, CurrentUser, RolesGuard } from 'src/user';
import { GetTeacherReviewsQueryParameters } from './query-parameters/get-teacher-reviews.query-parameters';
import { IInfiniteScrollResponse } from 'src/shared';
import { CreateTeacherReviewLikeDto } from './dto/create-teacher-review-like.dto';
import { LikeService } from 'src/like/like.service';
import { LikeOwnerGuard } from 'src/like/like-owner-like.guard';
import {
  ExtendedTeacherReview,
  ExtendedTeacherReviewResponse,
} from './interfaces/teacher.interface';

@UseGuards(AccessTokenGuard)
@Controller('teacher-reviews')
export class TeacherReviewController {
  constructor(
    private readonly teacherReviewService: TeacherReviewService,
    private readonly likeService: LikeService
  ) {}

  @Post()
  async createOne(
    @CurrentUser('id') userId: string,
    @Body() body: CreateTeacherReviewDto
  ): Promise<TeacherReview> {
    return this.teacherReviewService.createOne({
      ...body,
      isChecked: false,

      user: { connect: { id: userId } },
      teacher: {
        connect: { id: body.teacherId },
      },
    });
  }

  @Get()
  async findMany(
    @Query()
    {
      teacherId,
      isChecked,
      cursor,
      limit,
      includeComments,
    }: GetTeacherReviewsQueryParameters
  ): Promise<IInfiniteScrollResponse<ExtendedTeacherReviewResponse>> {
    const teachersReviews = (await this.teacherReviewService.findMany({
      take: limit,
      skip: cursor,
      include: {
        user: true,
      },
      where: {
        teacher: { id: teacherId },
        isChecked: isChecked || false,
        ...(includeComments ? { message: { not: null } } : {}),
      },
    })) as ExtendedTeacherReview[];

    const nextCursor = teachersReviews.length < limit ? null : cursor + limit;

    const reviewIds = teachersReviews.map((review) => review.id)

    const likesCounts = await this.likeService.groupBy(reviewIds);

    const likesMap = likesCounts.reduce((acc, { teacherReviewId, _count }) => {
      acc[teacherReviewId] = _count.teacherReviewId;
      return acc;
    }, {} as Record<string, number>);
  

    return {
      data: teachersReviews.map((el) => ({
        ...el,
        user: {
          nickName: el.user.nickName,
          id: el.userId,
        },
        likesCount:likesMap[el.id] || 0,
        userId: undefined,
      })),
      nextCursor,
    };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherReviewService.deleteOne({ id });
  }

  @UseGuards(RolesGuard, AccessTokenGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/approve/:id')
  async approve(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: true }
    );
  }

  @UseGuards(RolesGuard, AccessTokenGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put('/unapprove/:id')
  async unapprove(@Param('id') id: string): Promise<TeacherReview> {
    return await this.teacherReviewService.updateOne(
      { id },
      { isChecked: false }
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('/like')
  public async like(
    @CurrentUser('id') userId: string,
    @Body() { teacherReviewId }: CreateTeacherReviewLikeDto
  ): Promise<Like> {
    return await this.likeService.createOne({
      data: {
        teacherReview: { connect: { id: teacherReviewId } },
        user: { connect: { id: userId } },
      },
    });
  }

  @UseGuards(AccessTokenGuard, LikeOwnerGuard)
  @Delete(':likeId')
  public async unlike(
    @Param('likeId') likeId: string
  ): Promise<{ message: 'Success' | 'Fail' }> {
    await this.likeService.deleteOne({ id: likeId });

    return { message: 'Success' };
  }
}
