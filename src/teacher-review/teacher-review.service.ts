import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma';
import { TeacherReviewsFilterDto } from './dto/teachers-ratings-filter.dto';
import { GetTeachersQueryParameters } from 'src/teacher/query-parameters/get-teacher.query-parameters';

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

  async groupBy(dto: GetTeachersQueryParameters) {
    const havingClause: Record<string, any> = {};
  
    const addAvgCondition = (field: string, min?: number, max?: number) => {
      const conditions: Record<string, any> = {};
      if (min !== undefined) conditions.gte = min;
      if (max !== undefined) conditions.lte = max;
      if (Object.keys(conditions).length > 0) {
        havingClause[field] = { _avg: conditions };
      }
    };
  
    addAvgCondition('freebie', dto.minFreebie, dto.maxFreebie);
    addAvgCondition('friendliness', dto.minFriendliness, dto.maxFriendliness);
    addAvgCondition('experienced', dto.minExperienced, dto.maxExperienced);
    addAvgCondition('strictness', dto.minStrictness, dto.maxStrictness);
    addAvgCondition('smartless', dto.minSmartless, dto.maxSmartless);
    addAvgCondition('avgRating', dto.minAvgRating, dto.maxAvgRating);
  
    return this.prisma.teacherReview.groupBy({
      by: ['teacherId'],
      _avg: {
        freebie: true,
        friendliness: true,
        experienced: true,
        strictness: true,
        smartless: true,
        avgRating: true,
      },      
  
      ...(Object.keys(havingClause).length > 0 ? { having: havingClause } : {}),
    });
  }

  async aggregate(args: Prisma.TeacherReviewAggregateArgs) {
    return await this.prisma.teacherReview.aggregate(args);
  }

  async findManyAvgRatings(teachersIds: string[]) {
    return await this.prisma.teacherReview.groupBy({
      by: ['teacherId'],
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
        avgRating: true,
      },
    });
  }
}
