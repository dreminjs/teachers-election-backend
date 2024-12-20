import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { retry } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createOne(dto: Prisma.UserCreateInput) {

    return await this.prisma.user.create({ data: dto });
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    return await this.prisma.user.findFirst({ where });
  }
}
