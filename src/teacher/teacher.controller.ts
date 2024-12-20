import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeacherService } from './teacher.service';
import { Teacher } from '@prisma/client';
import { generateRandomString } from 'src/shared';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

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
    @Query('take') take: number,
    page: number,
    search: string
  ): Promise<Teacher[]> {
    return await this.teacherService.findMany({
      take: 100,
      where: search ? { fullName: { contains: search } } : {},
      skip: (page - 1) * take,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.teacherService.deleteOne({ id });
  }
}
