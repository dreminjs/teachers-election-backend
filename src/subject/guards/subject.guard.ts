import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubjectService } from '../subject.service';
import { Request } from 'express';

@Injectable()
export class SubjectGuard implements CanActivate {
  constructor(private readonly subjectService: SubjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const id = request.params.id;

    const subject = await this.subjectService.findOne({ where: { id } });

    if (!subject) {
      throw new NotFoundException('Такого предмета не существует');
    }

    return true;
  }
}
