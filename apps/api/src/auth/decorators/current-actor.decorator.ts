import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Actor } from '../types/actor.js';
import { AuthenticatedRequest } from '../types/authenticated-request.js';

export const CurrentActor = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Actor => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const {authContext} = request;

    return {
      userId: authContext.user.id,
      firebaseUid: authContext.user.firebaseUid,
      role: authContext.user.role,
    };
  },
);
