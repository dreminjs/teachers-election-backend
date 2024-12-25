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
import { Prisma } from '@prisma/client';
import { AccessTokenStrategy } from 'src/auth/strategies/access-token.strategy';
import { SubjectGuard } from './guards/subject.guard';

@UseGuards(AccessTokenStrategy)
@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  private logger = new Logger(SubjectController.name);

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
        orderBy: { id: 'desc' } as Prisma.SubjectOrderByWithRelationInput,
      });

      this.logger.log(subjects);

      return {
        data: subjects,
        nextCursor: subjects.length < limit ? null : cursor + limit,
      };
    }
  }

  @UseGuards(SubjectGuard)
  @Delete(':id')
  public async deleteOne(@Param('id') id: string): Promise<void> {
    await this.subjectService.deleteOne({ id });
  }

  @UseGuards(SubjectGuard)
  @Put(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: CreateSubjectDto
  ) {
    return await this.subjectService.updateOne({ id }, dto);
  }
}
