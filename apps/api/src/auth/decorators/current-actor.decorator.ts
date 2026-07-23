import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Actor } from '../types/actor.js';
import { AuthenticatedRequest } from '../types/authenticated-requtest';

export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Actor => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return {
      userId: request.authContext.user.id,
      firebaseUid: request.authContext.user.firebaseUid,
      role: request.authContext.user.role,
    };
  },
);
