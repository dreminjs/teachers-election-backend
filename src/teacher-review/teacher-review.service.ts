import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TeacherReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: Prisma.TeacherReviewCreateInput) {
    return await this.prisma.teacherReview.create({ data: dto });
  }

  async findMany(dto: Prisma.TeacherReviewWhereInput) {
    return await this.prisma.teacherReview.findMany({ where: dto });
  }
}
