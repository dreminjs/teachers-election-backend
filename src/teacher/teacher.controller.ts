import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Teacher } from '@prisma/client';
import { File } from '../shared';
import {
  IInfiniteScrollResponse,
  ITeacherExtended,
} from 'src/shared';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { ITeacherExtendedResponse } from 'src/shared/interfaces/teacher.interface';
import { AccessTokenGuard } from 'src/token';
import { FileInterceptor } from '@nestjs/platform-express';
import { calculateAverageRating } from './model/calculateAvgRating';

@UseGuards(AccessTokenGuard)
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(@Body() body, @File() photo: string): Promise<Teacher> {
    return await this.teacherService.createOne({
      fullName: body.fullName,
      subject: {
        connect: { id: body.subjectId },
      },
      photo,
    });
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
        avgRating: calculateAverageRating(teacher.teacherReview),
        subjectId: undefined,
        teacherReview: undefined,
      })),
      nextCursor,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Omit<ITeacherExtended,"subjectId">> {
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
    })) as ITeacherExtended

    return {
      id: teacher.id,
      fullName: teacher.fullName,
      subject: teacher.subject,
      photo: teacher.photo,
      teacherReview: teacher.teacherReview,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherService.deleteOne({ id });
  }
}
