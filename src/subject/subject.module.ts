import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { PrismaModule } from 'src/prisma';
import { AuthModule } from 'src/auth';
import { SubjectGuard } from './guards/subject.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SubjectController],
  providers: [SubjectService,SubjectGuard],
})
export class SubjectModule {}
