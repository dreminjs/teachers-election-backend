import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { PrismaModule } from 'src/prisma';
import { SubjectGuard } from './guards/subject.guard';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user';

@Module({
  imports: [PrismaModule, ConfigModule, UserModule],
  controllers: [SubjectController],
  providers: [SubjectService, SubjectGuard],
})
export class SubjectModule {}
