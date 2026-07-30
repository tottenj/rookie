import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../generated/prisma/enums';
import type { RequestWithOptionalAuthContext } from '../types/request-authenticated-request';
import { ROLES_KEY } from '../decorators/authorization/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No @Roles() decorator means there is no role restriction.
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithOptionalAuthContext>();

    const user = request.authContext?.user;

    if (!user) {
      throw new ForbiddenException('An application user is required for this route.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this route.');
    }

    return true;
  }
}
