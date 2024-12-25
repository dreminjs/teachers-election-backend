import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { ISubjectsResponse } from './interfaces/subject.interfaces';
import { Prisma } from '@prisma/client';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  public async createOne(@Body() dto: CreateSubjectDto) {
    return await this.subjectService.createOne(dto);
  }

  @Get()
  public async findMany(
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<ISubjectsResponse> {
    {
      const subjects = await this.subjectService.findMany({
        skip: cursor,
        take: limit,
        orderBy: { createdAt: Prisma.SortOrder.desc } as Prisma.SubjectOrderByWithRelationInput
      });

      return {
        data: subjects,
        nextCursor: subjects.length < limit ? null : cursor + limit,
      };
    }
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    return await this.subjectService.deleteOne({ id });
  }

  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: CreateSubjectDto
  ) {
    return await this.subjectService.updateOne({ id }, dto);
  }
}
