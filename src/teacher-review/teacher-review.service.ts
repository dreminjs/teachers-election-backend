import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma';


@Injectable()
export class TeacherReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: Prisma.TeacherReviewCreateInput) {
    return await this.prisma.teacherReview.create({ data: dto })
  }

  async findMany(args: Prisma.TeacherReviewFindManyArgs) {
    return await this.prisma.teacherReview.findMany(args);
  }

  async findOne(where: Prisma.TeacherReviewWhereUniqueInput) {
    return await this.prisma.teacherReview.findFirst({ where });
  }

  async updateOne(where: Prisma.TeacherReviewWhereUniqueInput, dto: Prisma.TeacherReviewUpdateInput) {
    return await this.prisma.teacherReview.update({ where, data: dto });
  }

  async deleteOne(where: Prisma.TeacherReviewWhereUniqueInput) {
    return await this.prisma.teacherReview.delete({ where });
  }
}
