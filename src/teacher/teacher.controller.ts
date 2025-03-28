import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Roles, Teacher } from '@prisma/client';
import { IInfiniteScrollResponse } from 'src/shared';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { AccessTokenGuard } from 'src/token';
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
    private readonly teacherReviewServce: TeacherReviewService
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
    { cursor, limit, search, subjectIds, ...dto }: GetTeachersQueryParameters
  ): Promise<IInfiniteScrollResponse<ITeacherExtended>> {
    const teachers = (await this.teacherService.findMany({
      take: limit,
      skip: cursor,
      where: {
        ...(search ? { fullName: { contains: search } } : {}),
        ...(subjectIds ? { subjectId: { in: subjectIds } } : {}),
        ...(dto.minAvgRating || dto.maxAvgRating
          ? {
              teacherReview: {
                some: {
                  avgRating: {
                    ...(dto.minAvgRating ? { gte: dto.minAvgRating } : {}),
                    ...(dto.maxAvgRating ? { lte: dto.maxAvgRating } : {}),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        subject: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    })) as ITeacherExtended[];

    // const avgRatings = await this.teacherReviewServce.findManyAvgRatings([
    //   ...teachers.map((el) => el.id),
    // ]);

    const ratingsMap = new Map(
      [].map((item) => [
        item.teacherId,
        {
          freebie: Math.round(item._avg.freebie || 0),
          friendliness: Math.round(item._avg.friendliness || 0),
          experienced: Math.round(item._avg.experienced || 0),
          smartless: Math.round(item._avg.smartless || 0),
          strictness: Math.round(item._avg.strictness || 0),
          avgRatings: Number(item._avg.avgRating.toFixed(2)) || 0,
        },
      ])
    );

    const enhancedTeachers = teachers.map((teacher) => ({
      ...teacher,
      avgRatings: ratingsMap.get(teacher.id) || null,
    }));

    const nextCursor = enhancedTeachers.length < limit ? null : cursor + limit;

    return {
      data: enhancedTeachers,
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
        subject: { title },
        ...dto
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
      fullName: fullName ? fullName : 'anon',
      subject: title,
      photo: dto?.photo ? dto.photo : null,
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
