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

@UseGuards(AccessTokenGuard)
@Controller('teachers')
export class TeacherController {
  constructor(
    private readonly teacherService: TeacherService,
    private readonly minioClientService: MinioClientService
  ) {}

  @UseInterceptors(FileInterceptor('file'), MinioFileUploadInterceptor)
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() body: CreateTeacherDto,
    @MinioFileName() fileName: string
  ): Promise<Teacher> {
    return await this.teacherService.createOne({
      fullName: body.fullName,
      subject: {
        connect: { id: body.subjectId },
      },
      photo: fileName,
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
    @MinioFileName() fileName?: string
  ): Promise<Teacher> {
    if (fileName) {
      const { photo } = await this.teacherService.findOne({
        where: { fullName },
      });

      await this.minioClientService.deleteOne(photo);
    }

    return await this.teacherService.updateOne(
      { id },
      {
        ...(fullName ? { fullName } : {}),
        ...(fileName ? { photo: fileName } : {}),
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
      thresholdRating,
      rating,
      
    }: GetTeachersQueryParameters
  ): Promise<IInfiniteScrollResponse<ITeacherExtendedResponse>> {
    const teachers = (await this.teacherService.findMany({
      take: limit,
      where: {
        ...(search ? { fullName: { contains: search } } : {}),
        ...(subjectIds ? { subjectId: { in: subjectIds } } : {}),
        ...(thresholdRating
          ? { teacherReview: { some: { grade: { gte: thresholdRating } } } }
          : {}),
        ...(rating ? { teacherReview: { some: { grade: rating } } } : {}),
        
      },
      include: {
        subject: {
          select: {
            title: true,
          },
        },
        teacherReview: {
          select: { grade: true },
        },
      },
      skip: cursor,
    })) as ITeacherExtended[];

    const nextCursor = teachers.length < limit ? null : cursor + limit;

    return {
      data: teachers.map((teacher) => ({
        ...teacher,
        subject: teacher.subject.title,
        avgRating: calculateAverageRating(
          teacher.teacherReview.map((el) => el.grade)
        ),
        subjectId: undefined,
        teacherReview: undefined,
      })),
      nextCursor,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ITeacherExtendedResponse> {
    const teacher = (await this.teacherService.findOne({
      where: { id },
      include: {
        subject: {
          select: {
            title: true,
          },
        },
        teacherReview: {
          select: { grade: true },
        },
      },
    })) as ITeacherExtended;

    return {
      id: teacher.id,
      fullName: teacher.fullName,
      subject: teacher.subject.title,
      photo: teacher.photo,
      avgRating: calculateAverageRating(
        teacher.teacherReview.map((el) => el.grade)
      ),
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherService.deleteOne({ id });
  }
}
