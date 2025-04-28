import { Injectable } from '@nestjs/common';
import { Prisma, Teacher } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: Prisma.TeacherCreateInput): Promise<Teacher> {
    return await this.prisma.teacher.create({ data: dto });
  }

  async findMany(dto: Prisma.TeacherFindManyArgs = {}): Promise<Teacher[]> {
    return await this.prisma.teacher.findMany({ ...dto });
  }

  async findOne(args: Prisma.TeacherFindFirstArgs): Promise<Teacher> {
    return await this.prisma.teacher.findFirst(args);
  }

  async updateOne(where: Prisma.TeacherWhereUniqueInput, dto: Prisma.TeacherUpdateInput): Promise<Teacher> {
    return await this.prisma.teacher.update({ where, data: dto });
  }

  async deleteOne(where: Prisma.TeacherWhereUniqueInput): Promise<Teacher> {
    return await this.prisma.teacher.delete({ where });
  }
}
