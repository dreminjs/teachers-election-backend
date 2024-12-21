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
  ) {
    {
      return await this.subjectService.findMany({ skip: cursor, take: limit });
    }
  }
  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    return await this.subjectService.deleteOne({ id });
  }

  @Put(":id")
  public async updateOne(@Param('id') id: string, @Body() dto: CreateSubjectDto) {
    return await this.subjectService.updateOne({ id }, dto);
  }
}
