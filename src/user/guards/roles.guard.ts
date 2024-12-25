import { Injectable, CanActivate, ExecutionContext, HttpException, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private logger = new Logger(RolesGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = context.switchToHttp().getRequest().user as User

    this.logger.log(`User roles: ${user.role}`)

    const isAuthorized = requiredRoles.some((role) => user.role?.includes(role));

    if (!isAuthorized || !requiredRoles) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return true
  }
}

