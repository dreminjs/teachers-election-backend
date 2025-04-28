import { Injectable, Logger } from '@nestjs/common';
import { Prisma, Subject } from '@prisma/client';
import { PrismaService } from 'src/prisma';

@Injectable()
export class SubjectService {
  constructor(private readonly prisma: PrismaService) {}

  private logger = new Logger(SubjectService.name);

  public async findMany(args: Prisma.SubjectFindManyArgs): Promise<Subject[]> {
    return await this.prisma.subject.findMany({ ...args });
  }

  public async findOne(args: Prisma.SubjectFindManyArgs) {
    return await this.prisma.subject.findFirst(args);
  }

  public async createOne(dto: Prisma.SubjectCreateInput) {
    return await this.prisma.subject.create({ data: dto });
  }

  public async updateOne(
    where: Prisma.SubjectWhereUniqueInput,
    dto: Prisma.SubjectUpdateInput,
  ) {
    return await this.prisma.subject.update({ where, data: dto });
  }

  public async deleteOne(where: Prisma.SubjectWhereUniqueInput): Promise<void> {
    await this.prisma.subject.delete({where})
  }

  public async count(args: Prisma.SubjectCountArgs): Promise<number> {
    return await this.prisma.subject.count(args)
  }
}
