import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Prisma, Roles, Subject } from '@prisma/client';
import { SubjectGuard } from './guards/subject.guard';
import { AllowedRoles, RolesGuard } from 'src/user';
import { AccessTokenGuard } from 'src/auth';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { IWithPagination } from 'src/shared/interfaces/with-pagination';
import { IGetSubjectsQueryParameters } from './interfaces/subject.interfaces';
import { IInfiniteScrollResponse } from 'src/shared';

@UseGuards(AccessTokenGuard)
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @UseGuards(RolesGuard)
  @AllowedRoles(Roles.ADMIN)
  public async createOne(@Body() dto: CreateSubjectDto) {
    return await this.subjectService.createOne(dto);
  }

  @Get()
  public async findMany(
    @Query() { limit, cursor, title, page }: IGetSubjectsQueryParameters
  ): Promise<IWithPagination<Subject> | IInfiniteScrollResponse<Subject>> {
    const [items, count] = await Promise.all([
      await this.subjectService.findMany({
        skip: page ? (page - 1) * limit : cursor,
        take: limit,
        orderBy: { createdAt: 'asc' } as Prisma.SubjectOrderByWithRelationInput,
        where: {
          ...(title && { title: { contains: title } }),
        },
      }),
      await this.subjectService.count({
        where: {
          ...(title ? { title: { contains: title } } : {}),
        },
      }),
    ]);

    if (page) {
      return {
        items,
        count,
        currentPage: page,
      };
    } else {
      const nextCursor = items.length < limit ? null : cursor + limit;
      return {
        nextCursor,
        data: items,
      };
    }
  }

  @UseGuards(SubjectGuard)
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  public async deleteOne(@Param('id') id: string): Promise<void> {
    await this.subjectService.deleteOne({ id });
  }

  @UseGuards(SubjectGuard)
  @AllowedRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: UpdateSubjectDto
  ) {
    return await this.subjectService.updateOne({ id }, dto);
  }
}
