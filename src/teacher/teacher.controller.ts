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
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Teacher } from '@prisma/client';

import {
  generateRandomString,
  IInfiniteScrollResponse,
  ITeacherExtended,
} from 'src/shared';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { ITeacherExtendedResponse } from 'src/shared/interfaces/teacher.interface';
import { AccessTokenGuard } from 'src/token';


@UseGuards(AccessTokenGuard)
@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  private logger = new Logger(TeacherController.name);

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createOne(
    @Body() body: CreateTeacherDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Teacher> {
    const code = generateRandomString(7);

    return await this.teacherService.createOne({
      fullName: body.fullName,
      subject: {
        connect: {
          id: body.subjectId,
        },
      },
      photo: code,
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
    const calculateAverageRating = (reviews: { grade: number }[]) => {
      const total = reviews.reduce((sum, review) => sum + review.grade, 0);
      return reviews.length ? total / reviews.length : 0;
    };

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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherService.deleteOne({ id });
  }
}
