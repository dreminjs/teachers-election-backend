import { Injectable } from '@nestjs/common';
import { Prisma, Subject, Teacher, TeacherReview } from '@prisma/client';
import { PrismaService } from 'src/prisma';
import { GetTeachersQueryParameters } from './query-parameters/get-teacher.query-parameters';
import { ITeacherExtendedResponse } from './teacher.interface';

@Injectable()
export class TeacherService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(data: Prisma.TeacherCreateInput): Promise<Teacher> {
    return await this.prisma.teacher.create({ data });
  }

  async findMany(dto: Prisma.TeacherFindManyArgs = {}): Promise<Teacher[]> {
    return await this.prisma.teacher.findMany({ ...dto });
  }

  async countBySQL(filters?: GetTeachersQueryParameters): Promise<number> {
    let countQuery = `
      SELECT COUNT(*) FROM (
        SELECT
          t.id
        FROM
          teachers t
        INNER JOIN
          teachers_subjects ts ON t.id = ts.teacher_id
        INNER JOIN
          subjets s ON ts.subject_id = s.id
        LEFT JOIN
          teachers_reviews tr ON t.id = tr.teacher_id`;
  
    const params = [];
    let paramIndex = 1;
  
    const whereConditions = [];
  
    if (filters?.search) {
      whereConditions.push(`t.full_name LIKE $${paramIndex++}`);
      params.push(`%${filters.search}%`);
    }
  
    if (whereConditions.length > 0) {
      countQuery += ` WHERE ${whereConditions.join(' AND ')}`;
    }
  
    countQuery += `
      GROUP BY
        t.id`;
  
    const havingConditions = [];
  
    if (filters?.minAvgRating) {
      havingConditions.push(`AVG(tr.avg_rating) >= $${paramIndex++}::numeric`);
      params.push(filters.minAvgRating);
    }
    if (filters?.minFreebie) {
      havingConditions.push(`AVG(tr.freebie) >= $${paramIndex++}::numeric`);
      params.push(filters.minFreebie);
    }
    if (filters?.minFriendliness) {
      havingConditions.push(`AVG(tr.friendliness) >= $${paramIndex++}::numeric`);
      params.push(filters.minFriendliness);
    }
    if (filters?.minExperienced) {
      havingConditions.push(`AVG(tr.experienced) >= $${paramIndex++}::numeric`);
      params.push(filters.minExperienced);
    }
    if (filters?.minStrictness) {
      havingConditions.push(`AVG(tr.strictness) >= $${paramIndex++}::numeric`);
      params.push(filters.minStrictness);
    }
    if (filters?.minSmartless) {
      havingConditions.push(`AVG(tr.smartless) >= $${paramIndex++}::numeric`);
      params.push(filters.minSmartless);
    }
  
    if (filters?.maxAvgRating) {
      havingConditions.push(`AVG(tr.avg_rating) <= $${paramIndex++}::numeric`);
      params.push(filters.maxAvgRating);
    }
    if (filters?.maxFreebie) {
      havingConditions.push(`AVG(tr.freebie) <= $${paramIndex++}::numeric`);
      params.push(filters.maxFreebie);
    }
    if (filters?.maxFriendliness) {
      havingConditions.push(`AVG(tr.friendliness) <= $${paramIndex++}::numeric`);
      params.push(filters.maxFriendliness);
    }
    if (filters?.maxExperienced) {
      havingConditions.push(`AVG(tr.experienced) <= $${paramIndex++}::numeric`);
      params.push(filters.maxExperienced);
    }
    if (filters?.maxStrictness) {
      havingConditions.push(`AVG(tr.strictness) <= $${paramIndex++}::numeric`);
      params.push(filters.maxStrictness);
    }
    if (filters?.maxSmartless) {
      havingConditions.push(`AVG(tr.smartless) <= $${paramIndex++}::numeric`);
      params.push(filters.maxSmartless);
    }
  
    if (havingConditions.length > 0) {
      countQuery += ` HAVING ${havingConditions.join(' AND ')}`;
    }
  
    countQuery += `) AS count_query`;
  
    const result = await this.prisma.$queryRawUnsafe<[{ count: string }]>(countQuery, ...params);
    
    return parseInt(result[0].count, 10);
  }
  async findManyBySQL(filters?: GetTeachersQueryParameters): Promise<ITeacherExtendedResponse[]> {
    const take = filters?.limit || 10;
    const skip = filters?.cursor || 0;

    let query = `
      SELECT
        t.id AS teacher_id,
        t.full_name,
        t.photo,
        s.id AS subject_id,
        s.title AS subject_title,
        AVG(tr.avg_rating)::FLOAT AS avg_rating,
        AVG(tr.freebie)::FLOAT AS avg_freebie,
        AVG(tr.friendliness)::FLOAT AS avg_friendliness,
        AVG(tr.experienced)::FLOAT AS avg_experienced,
        AVG(tr.strictness)::FLOAT AS avg_strictness,
        AVG(tr.smartless)::FLOAT AS avg_smartless
      FROM
        teachers t
      INNER JOIN
        teachers_subjects ts ON t.id = ts.teacher_id
      INNER JOIN
        subjets s ON ts.subject_id = s.id
      LEFT JOIN
        teachers_reviews tr ON t.id = tr.teacher_id`;

    const params = [];
    let paramIndex = 1;

    const whereConditions = [];

    if (filters?.search) {
      whereConditions.push(`t.full_name LIKE $${paramIndex++}`);
      params.push(`%${filters.search}%`);
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    query += `
      GROUP BY
        t.id, t.full_name, t.photo, s.id, s.title`;

    const havingConditions = [];

    if (filters?.minAvgRating) {
      havingConditions.push(`AVG(tr.avg_rating) >= $${paramIndex++}::numeric`);
      params.push(filters.minAvgRating);
    }
    if (filters?.minFreebie) {
      havingConditions.push(`AVG(tr.freebie) >= $${paramIndex++}::numeric`);
      params.push(filters.minFreebie);
    }
    if (filters?.minFriendliness) {
      havingConditions.push(
        `AVG(tr.friendliness) >= $${paramIndex++}::numeric`
      );
      params.push(filters.minFriendliness);
    }
    if (filters?.minExperienced) {
      havingConditions.push(`AVG(tr.experienced) >= $${paramIndex++}::numeric`);
      params.push(filters.minExperienced);
    }
    if (filters?.minStrictness) {
      havingConditions.push(`AVG(tr.strictness) >= $${paramIndex++}::numeric`);
      params.push(filters.minStrictness);
    }
    if (filters?.minSmartless) {
      havingConditions.push(`AVG(tr.smartless) >= $${paramIndex++}::numeric`);
      params.push(filters.minSmartless);
    }

    if (filters?.maxAvgRating) {
      havingConditions.push(`AVG(tr.avg_rating) <= $${paramIndex++}::numeric`);
      params.push(filters.maxAvgRating);
    }
    if (filters?.maxFreebie) {
      havingConditions.push(`AVG(tr.freebie) <= $${paramIndex++}::numeric`);
      params.push(filters.maxFreebie);
    }
    if (filters?.maxFriendliness) {
      havingConditions.push(
        `AVG(tr.friendliness) <= $${paramIndex++}::numeric`
      );
      params.push(filters.maxFriendliness);
    }
    if (filters?.maxExperienced) {
      havingConditions.push(`AVG(tr.experienced) <= $${paramIndex++}::numeric`);
      params.push(filters.maxExperienced);
    }
    if (filters?.maxStrictness) {
      havingConditions.push(`AVG(tr.strictness) <= $${paramIndex++}::numeric`);
      params.push(filters.maxStrictness);
    }
    if (filters?.maxSmartless) {
      havingConditions.push(`AVG(tr.smartless) <= $${paramIndex++}::numeric`);
      params.push(filters.maxSmartless);
    }

    if (havingConditions.length > 0) {
      query += ` HAVING ${havingConditions.join(' AND ')}`;
    }

    query += `
      ORDER BY
        t.full_name, s.title`;

    query += ` LIMIT $${paramIndex++}::bigint OFFSET $${paramIndex++}::bigint`;

    params.push(take);
    params.push(skip);

    const rawResult = await this.prisma.$queryRawUnsafe<
      Array<{
        teacher_id: string;
        full_name: string;
        photo: string;
        subject_id: string;
        subject_title: string;
        avg_rating: number;
        avg_freebie: number;
        avg_friendliness: number;
        avg_experienced: number;
        avg_strictness: number;
        avg_smartless: number;
      }>
    >(query, ...params);

    const teacherMap = new Map<string, any>()

    for (const row of rawResult) {
      if (!teacherMap.has(row.teacher_id)) {
        teacherMap.set(row.teacher_id, {
          id: row.teacher_id,
          fullName: row.full_name,
          photo: row.photo,
          avgRatings:{
            freebie:row.avg_freebie,
            strictness: row.avg_strictness,
            experienced: row.avg_experienced,
            friendliness: row.avg_friendliness,
            smartless: row.avg_smartless
          },
          avgRating: row.avg_rating,
          subjects: [],
        });
      }
      teacherMap.get(row.teacher_id).subjects.push({
        id: row.subject_id,
        title: row.subject_title,
      });
    }

    return Array.from(teacherMap.values());
  }

  async findOne(args: Prisma.TeacherFindFirstArgs): Promise<Teacher> {
    return await this.prisma.teacher.findFirst(args);
  }

  async updateOne(
    where: Prisma.TeacherWhereUniqueInput,
    dto: Prisma.TeacherUpdateInput
  ): Promise<Teacher> {
    return await this.prisma.teacher.update({ where, data: dto });
  }

  async deleteOne(where: Prisma.TeacherWhereUniqueInput): Promise<Teacher> {
    return await this.prisma.teacher.delete({ where });
  }
}
