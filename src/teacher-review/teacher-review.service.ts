import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma';

@Injectable()
export class TeacherReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: Prisma.TeacherReviewCreateInput) {
    return await this.prisma.teacherReview.create({ data: dto });
  }

  async findMany(args: Prisma.TeacherReviewFindManyArgs) {
    return await this.prisma.teacherReview.findMany(args);
  }

  async findOne(where: Prisma.TeacherReviewWhereUniqueInput) {
    return await this.prisma.teacherReview.findFirst({ where });
  }

  async updateOne(
    where: Prisma.TeacherReviewWhereUniqueInput,
    dto: Prisma.TeacherReviewUpdateInput
  ) {
    return await this.prisma.teacherReview.update({ where, data: dto });
  }

  async deleteOne(where: Prisma.TeacherReviewWhereUniqueInput) {
    return await this.prisma.teacherReview.delete({ where });
  }

  async count(args: Prisma.TeacherReviewCountArgs): Promise<number> {
    return await this.prisma.teacherReview.count(args);
  }

  async aggregate(args: Prisma.TeacherReviewAggregateArgs) {
    return await this.prisma.teacherReview.aggregate(args);
  }

  async findManyAvgRatings(teachersIds:string[]) {
    return await this.prisma.teacherReview.groupBy({
      by: ["teacherId"],
      where: {
        teacherId: {
          in: teachersIds,
        },
      },
      _avg: {
        freebie: true,
        smartless: true,
        strictness: true,
        experienced: true,
        friendliness: true,
      },
    });
  }

  // DOESN'T BEST PRACTICE
  // async groupBy(args: { by: string[] }) {
  //   return await this.prisma.teacherReview.groupBy({
  //     _avg: {
  //       freebie: true,
  //       smartless: true,
  //       strictness: true,
  //       experienced: true,
  //       friendliness: true,
  //     },
  //   });
  // }
}
