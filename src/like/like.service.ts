import { Injectable } from '@nestjs/common';
import { Prisma, Like } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}
  async createOne(args: Prisma.LikeCreateArgs): Promise<Like> {
    return await this.prisma.like.create(args);
  }

  async deleteOne(where: Prisma.LikeWhereUniqueInput): Promise<Like> {
    return await this.prisma.like.delete({ where });
  }

  async findOne(where: Prisma.LikeWhereUniqueInput): Promise<Like> {
    return await this.prisma.like.findFirst({ where });
  }

  async count(where: Prisma.LikeWhereUniqueInput) {
    return await this.prisma.like.count({ where });
  }

  async groupBy(reviewIds: string[]) {
    return await this.prisma.like.groupBy({
      by: ['teacherReviewId'],
      _count: { teacherReviewId: true }, // Считаем количество лайков для каждого отзыва
      where: { teacherReviewId: { in: reviewIds } }, // Фильтруем только нужные отзывы
    });
  }
}
