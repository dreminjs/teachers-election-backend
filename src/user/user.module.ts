import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService,RolesGuard],
  exports: [UserService],
})
export class UserModule {}
