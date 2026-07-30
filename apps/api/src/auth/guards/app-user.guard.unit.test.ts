import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { createAuthContextFactory } from '../../../test/factories/auth/authContext.factory';
import { createHttpExecutionContext } from '../../../test/factories/nest/executionContext.factory';
import { AuthContextService } from '../services/auth-context.service';
import type { RequestWithOptionalAuthContext } from '../types/request-authenticated-request';
import { AppUserGuard } from './app-user.guard';

describe('AppUserGuard', () => {
  let guard: AppUserGuard;
  let authContextService: jest.Mocked<Pick<AuthContextService, 'resolve'>>;

  beforeEach(async () => {
    authContextService = {
      resolve: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AppUserGuard,
        {
          provide: AuthContextService,
          useValue: authContextService,
        },
      ],
    }).compile();

    guard = moduleRef.get(AppUserGuard);
  });

  describe('canActivate', () => {
    it('resolves the auth context and attaches it to the request', async () => {
      const mockAuthContext = createAuthContextFactory();

      const { context, request } =
        createHttpExecutionContext<RequestWithOptionalAuthContext>({
          request: {
            principal: mockAuthContext.principal,
          },
        });

      authContextService.resolve.mockResolvedValue(mockAuthContext);

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(authContextService.resolve).toHaveBeenCalledTimes(1);
      expect(authContextService.resolve).toHaveBeenCalledWith(
        mockAuthContext.principal,
      );
      expect(request.authContext).toEqual(mockAuthContext);
    });

    it('throws when the request does not have a principal', async () => {
      const { context, request } =
        createHttpExecutionContext<RequestWithOptionalAuthContext>();

      const error = new UnauthorizedException(
        'A Firebase principal is required.',
      );

      authContextService.resolve.mockRejectedValue(error);

      await expect(guard.canActivate(context)).rejects.toThrow(
        'A Firebase principal is required.',
      );

      expect(authContextService.resolve).toHaveBeenCalledWith(undefined);
      expect(request.authContext).toBeUndefined();
    });
  });
});
