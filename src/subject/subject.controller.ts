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
import { ISubjectsResponse } from './interfaces/subject.interfaces';
import { Prisma, Roles } from '@prisma/client';
import { SubjectGuard } from './guards/subject.guard';
import { AllowedRoles, RolesGuard } from 'src/user';
import { AccessTokenGuard } from 'src/auth';

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
    @Query('cursor', ParseIntPipe) cursor: number,
    @Query('limit', ParseIntPipe) limit: number
  ): Promise<ISubjectsResponse> {
    {
      const subjects = await this.subjectService.findMany({
        skip: cursor,
        take: limit,
        orderBy: { id: 'desc' } as Prisma.SubjectOrderByWithRelationInput,
      });

      return {
        data: subjects,
        nextCursor: subjects.length < limit ? null : cursor + limit,
      };
    }
  }

  @UseGuards(RolesGuard)
  @UseGuards(SubjectGuard)
  @AllowedRoles(Roles.ADMIN)
  @Delete(':id')
  public async deleteOne(@Param('id') id: string): Promise<void> {
    await this.subjectService.deleteOne({ id });
  }

  @UseGuards(SubjectGuard)
  @AllowedRoles(Roles.ADMIN)
  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: CreateSubjectDto
  ) {
    return await this.subjectService.updateOne({ id }, dto);
  }
}
