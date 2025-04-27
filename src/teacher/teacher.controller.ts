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
import { Prisma, Roles, Teacher } from '@prisma/client';
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
    private readonly teacherReviewService: TeacherReviewService,
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
    @Query() queryParams: GetTeachersQueryParameters
  ): Promise<any[]> {
    const {
      cursor: offset = 0,
      limit = 10,
      search,
      subjectIds,
      minAvgRating,
      maxAvgRating,
      minFreebie,
      maxFreebie,
      minFriendliness,
      maxFriendliness,
      minExperienced,
      maxExperienced,
      minStrictness,
      maxStrictness,
      minSmartless,
      maxSmartless,
      sortField = 'rating',
      sortOrder = 'desc'
    } = queryParams;
  
    // Явно преобразуем в числа
    const numericLimit = Number(limit);
    const numericOffset = Number(offset);
  
    // Строим условие ORDER BY
    let orderByClause = 'AVG(tr.avg_rating) DESC NULLS LAST';
    if (sortField && sortOrder) {
      const sortFieldMap = {
        freebie: 'AVG(tr.freebie)',
        friendliness: 'AVG(tr.friendliness)',
        experienced: 'AVG(tr.experienced)',
        strictness: 'AVG(tr.strictness)',
        smartless: 'AVG(tr.smartless)',
        rating: 'AVG(tr.avg_rating)'
      };
      
      const field = sortFieldMap[sortField] || 'AVG(tr.avg_rating)';
      orderByClause = `${field} ${sortOrder.toUpperCase()} NULLS LAST`;
    }
  
    const query = Prisma.sql`
      SELECT 
        t.id,
        t.full_name,
        t.photo,
        t.subjet_id,
        AVG(tr.freebie) AS avg_freebie,
        AVG(tr.friendliness) AS avg_friendliness,
        AVG(tr.experienced) AS avg_experienced,
        AVG(tr.strictness) AS avg_strictness,
        AVG(tr.smartless) AS avg_smartless,
        AVG(tr.avg_rating) AS avg_rating,
        COUNT(tr.id) AS review_count
      FROM 
        teachers t
      LEFT JOIN 
        teachers_reviews tr ON t.id = tr.teacher_id
      WHERE 
        (${search === null} OR t.full_name ILIKE '%' || ${search} || '%')
        AND (${subjectIds === null} OR t.subjet_id = ANY(${subjectIds}))
      GROUP BY 
        t.id, t.full_name, t.photo, t.subjet_id
      HAVING
        (${minAvgRating === null} OR AVG(tr.avg_rating) >= ${minAvgRating})
        AND (${maxAvgRating === null} OR AVG(tr.avg_rating) <= ${maxAvgRating})
        AND (${minFreebie === null} OR AVG(tr.freebie) >= ${minFreebie})
        AND (${maxFreebie === null} OR AVG(tr.freebie) <= ${maxFreebie})
        AND (${minFriendliness === null} OR AVG(tr.friendliness) >= ${minFriendliness})
        AND (${maxFriendliness === null} OR AVG(tr.friendliness) <= ${maxFriendliness})
        AND (${minExperienced === null} OR AVG(tr.experienced) >= ${minExperienced})
        AND (${maxExperienced === null} OR AVG(tr.experienced) <= ${maxExperienced})
        AND (${minStrictness === null} OR AVG(tr.strictness) >= ${minStrictness})
        AND (${maxStrictness === null} OR AVG(tr.strictness) <= ${maxStrictness})
        AND (${minSmartless === null} OR AVG(tr.smartless) >= ${minSmartless})
        AND (${maxSmartless === null} OR AVG(tr.smartless) <= ${maxSmartless})
      ORDER BY 
        ${Prisma.raw(orderByClause)}
      LIMIT 
        ${numericLimit}
      OFFSET 
        ${numericOffset}
    `;
  
    try {
      const result = await this.prisma.$queryRaw<any[]>(query);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw new Error('Failed to fetch teachers');
    }
  }

  @Get("test")
  public async test(){
    return await this.teacherReviewService.groupBy({})
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
