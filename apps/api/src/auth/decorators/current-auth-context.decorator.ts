import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request';
import type { AuthContext } from '../types/auth-context';

export const CurrentAuthContext = createParamDecorator((_data: unknown, context: ExecutionContext): AuthContext => {
  const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
  return request.authContext;
});
