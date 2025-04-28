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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Prisma, Roles, Teacher } from '@prisma/client';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { AccessTokenGuard } from 'src/token';
import type {
  ITeacherExtended,
  ITeacherExtendedResponse,
  ITeacherSubjectExtended,
} from './teacher.interface';
import { AllowedRoles, RolesGuard } from 'src/user';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioFileUploadInterceptor } from 'src/minio-client/minio-file-upload.interceptor';
import { MinioFileName } from 'src/minio-client/minio-file-name.decorator';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { TeacherReviewService } from 'src/teacher-review/teacher-review.service';
import { PrismaService } from 'src/prisma';
import { IInfiniteScrollResponse } from 'src/shared';

@UseGuards(AccessTokenGuard)
@Controller('teachers')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly minioClientService: MinioClientService,
    private readonly teacherReviewService: TeacherReviewService
  ) {}

  private logger = new Logger(TeacherController.name);

  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'), MinioFileUploadInterceptor)
  @AllowedRoles(Roles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() { fullName, subjectId }: CreateTeacherDto,
    @MinioFileName() photo: string
  ): Promise<Teacher> {
    return await this.teacherService.createOne({
      fullName,
      photo,
      teacherSubjects: {
        create: {
          subjectId,
        },
      },
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
  public async findMany(
    @Query() query: GetTeachersQueryParameters
  ): Promise<
    IInfiniteScrollResponse<
      Omit<ITeacherExtendedResponse, 'countTeacherReviews'>
    >
  > {
    const teachersQuery = this.teacherService.findManyBySQL(query);

    const [teachers] = await Promise.all([teachersQuery]);

    const nextCursor =
      teachers.length < query.limit ? null : query.cursor + query.limit;

    return {
      data: teachers,
      nextCursor,
    };
  }

  @Get('test')
  public async test() {
    return await this.teacherReviewService.groupBy({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ITeacherExtendedResponse> {
    const teacherQuery = this.teacherService.findOne({
      where: { id },
      include: {
        teacherSubjects: {
          include: {
            subject: true,
          },
        },
      },
    }) as Promise<ITeacherExtended>;

    const countTeacherReviewsQuery = this.teacherReviewService.count({
      where: {
        teacher: {
          id,
        },
      },
    });

    const avgRaingsQuery = this.teacherReviewService.aggregate({
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
      teacher,
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
      fullName: teacher.fullName,
      photo: teacher.photo,
      subjects: teacher.teacherSubjects.map((el) => el.subject),
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
