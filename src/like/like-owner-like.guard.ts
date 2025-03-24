import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { IExtendedRequest } from 'src/shared';
import { LikeService } from './like.service';

@Injectable()
export class LikeOwnerGuard implements CanActivate {
  constructor(private readonly likeService: LikeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const like = await this.likeService.findOne({
      id: req.params.id,
    });

    if (like.userId !== req.params.id) {
      throw new ForbiddenException('No!');
    }

    return true;
  }
}
