import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Roles, Teacher } from '@prisma/client';
import { File } from '../shared';
import { IInfiniteScrollResponse } from 'src/shared';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { AccessTokenGuard } from 'src/token';
import { calculateAverageRating } from './model/calculateAvgRating';
import type {
  ITeacherExtended,
  ITeacherExtendedResponse,
} from './teacher.interface';
import { AllowedRoles, RolesGuard } from 'src/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioFileUploadInterceptor } from 'src/minio-client/minio-file-upload.interceptor';
import { MinioFileName } from 'src/minio-client/minio-file-name.decorator';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { TeacherReviewService } from 'src/teacher-review/teacher-review.service';
import { PrismaService } from 'src/prisma';

@UseGuards(AccessTokenGuard)
@Controller('teachers')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly minioClientService: MinioClientService,
    private readonly teacherReviewServce: TeacherReviewService,
    private readonly prisma: PrismaService
  ) {}

  @UseInterceptors(FileInterceptor('file'), MinioFileUploadInterceptor)
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() { fullName, subjectId }: CreateTeacherDto,
    @MinioFileName() photo: string
  ): Promise<Teacher> {
    return await this.teacherService.createOne({
      fullName,
      subject: {
        connect: { id: subjectId },
      },
      photo,
    });
  }

  @UseInterceptors(FileInterceptor('file'), MinioFileUploadInterceptor)
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Patch(':id')
  async updateOne(
    @Body() { fullName, subjectId }: UpdateTeacherDto,
    @Param('id') id: string,
    @MinioFileName() photo?: string
  ): Promise<Teacher> {
    if (photo) {
      const { photo } = await this.teacherService.findOne({
        where: { fullName },
      });
      await this.minioClientService.deleteOne(photo);
    }
    return await this.teacherService.updateOne(
      { id },
      {
        ...(fullName ? { fullName } : {}),
        ...(photo ? { photo } : {}),
        ...(subjectId ? { subjectId } : {}),
      }
    );
  }

  @Get()
  async findMany(
    @Query()
    {
      cursor,
      limit,
      search,
      subjectIds,
      minRating,
      maxRating,
    }: GetTeachersQueryParameters
  ): Promise<
    IInfiniteScrollResponse<Omit<ITeacherExtendedResponse, 'avgRatings'>>
  > {
    const teachers = (await this.teacherService.findMany({
      take: limit,
      skip: cursor,
      where: {
        ...(search ? { fullName: { contains: search } } : {}),
        ...(subjectIds ? { subjectId: { in: subjectIds } } : {}),
      },
      include: {
        subject: {
          select: {
            title: true,
          },
        },
      },
    })) as ITeacherExtended[];

    const teacherRatings = await this.prisma.teacherReview.groupBy({
      by: ['teacherId'],
      _avg: {
        freebie: true,
        friendliness: true,
        experienced: true,
        strictness: true,
        smartless: true,
      },
      _count: true,
    });


    const ratingsMap = teacherRatings.reduce((acc, rating) => {
      const avgOverall =
        ((rating._avg.freebie || 0) +
          (rating._avg.friendliness || 0) +
          (rating._avg.experienced || 0) +
          (rating._avg.strictness || 0) +
          (rating._avg.smartless || 0)) /
        5;

      acc[rating.teacherId] = {
        avgRating: avgOverall,
        countTeacherReviews: rating._count,
      };
      return acc;
    }, {});

    const formattedTeachers = teachers
    .map((teacher) => ({
      id: teacher.id,
      fullName: teacher.fullName,
      subject: teacher.subject.title,
      photo: teacher.photo,
      avgRating: Math.round(ratingsMap[teacher.id]?.avgRating) || 0, // Если нет отзывов, ставим 0
      countTeacherReviews: ratingsMap[teacher.id]?.countTeacherReviews || 0,
    }))
    .filter((teacher) =>
      minRating !== undefined || maxRating !== undefined
        ? teacher.avgRating >= minRating || teacher.avgRating <= maxRating
        : true
    );


    const nextCursor = teachers.length < limit ? null : cursor + limit;

    return {
      data: formattedTeachers,
      nextCursor,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ITeacherExtendedResponse> {
    const teacherQuery = this.teacherService.findOne({
      where: { id },
      include: {
        subject: {
          select: {
            title: true,
          },
        },
      },
    }) as Promise<ITeacherExtended>;

    const countTeacherReviewsQuery = this.teacherReviewServce.count({
      where: {
        teacher: {
          id,
        },
      },
    });

    const avgRaingsQuery = this.teacherReviewServce.aggregate({
      where: { teacherId: id },
      _avg: {
        freebie: true,
        smartless: true,
        strictness: true,
        experienced: true,
        friendliness: true,
      },
    });

    const [
      {
        fullName,
        photo,
        subject: { title },
      },
      {
        _avg: { freebie, friendliness, experienced, smartless, strictness },
      },
      countTeacherReviews,
    ] = await Promise.all([
      teacherQuery,
      avgRaingsQuery,
      countTeacherReviewsQuery,
    ]);

    return {
      id,
      fullName,
      subject: title,
      photo,
      avgRatings: {
        freebie: Math.round(freebie),
        friendliness: Math.round(friendliness),
        experienced: Math.round(experienced),
        smartless: Math.round(smartless),
        strictness: Math.round(strictness),
      },
      countTeacherReviews,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherService.deleteOne({ id });
  }
}
