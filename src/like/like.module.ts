import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'src/prisma';

@Module({
  imports:[PrismaModule],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
