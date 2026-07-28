import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { FirebasePrincipal } from '../types/firebase-principal';
import type { FirebaseAuthenticatedRequest } from '../types/firebase-authenticated-request';

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): FirebasePrincipal => {
    const request = context
      .switchToHttp()
      .getRequest<FirebaseAuthenticatedRequest>();

    return request.principal;
  },
);
