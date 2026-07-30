import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';

import { FirebaseAuthService } from '../../infrastructure/firebase/firebase-auth.service';
import type { FirebaseAuthenticatedRequest } from '../types/firebase-authenticated-request';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { createHttpExecutionContext } from '../../../test/factories/nest/executionContext.factory';

describe('FirebaseAuthGuard', () => {
  let guard: FirebaseAuthGuard;

  let firebaseAuthService: jest.Mocked<
    Pick<FirebaseAuthService, 'verifyIdToken'>
  >;

  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  beforeEach(async () => {
    firebaseAuthService = {
      verifyIdToken: jest.fn(),
    };

    reflector = {
      getAllAndOverride: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        FirebaseAuthGuard,
        {
          provide: FirebaseAuthService,
          useValue: firebaseAuthService,
        },
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = moduleRef.get(FirebaseAuthGuard);
  });

  describe('canActivate', () => {
    it('allows public routes without verifying a token', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      const { context } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>();

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        expect.any(String),
        [context.getHandler(), context.getClass()],
      );

      expect(firebaseAuthService.verifyIdToken).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when authorization is missing', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      const { context } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>();

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('A Firebase ID token is required.'),
      );

      expect(firebaseAuthService.verifyIdToken).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when the authorization scheme is invalid', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      const { context } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>({
          request: {
            headers: {
              authorization: 'Basic token-value',
            },
          },
        });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('A Firebase ID token is required.'),
      );

      expect(firebaseAuthService.verifyIdToken).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException when the Bearer token is missing', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      const { context } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>({
          request: {
            headers: {
              authorization: 'Bearer',
            },
          },
        });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('A Firebase ID token is required.'),
      );

      expect(firebaseAuthService.verifyIdToken).not.toHaveBeenCalled();
    });

    it('verifies the token and attaches the Firebase principal', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      firebaseAuthService.verifyIdToken.mockResolvedValue({
        uid: 'firebase-user-123',
        email: 'user@example.com',
        email_verified: true,
      } as Awaited<ReturnType<FirebaseAuthService['verifyIdToken']>>);

      const { context, request } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>({
          request: {
            headers: {
              authorization: 'Bearer valid-token',
            },
          },
        });

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(firebaseAuthService.verifyIdToken).toHaveBeenCalledTimes(1);
      expect(firebaseAuthService.verifyIdToken).toHaveBeenCalledWith(
        'valid-token',
      );

      expect(request.principal).toEqual({
        firebaseUid: 'firebase-user-123',
        email: 'user@example.com',
        emailVerified: true,
      });
    });

    it('uses fallback values when Firebase omits email information', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      firebaseAuthService.verifyIdToken.mockResolvedValue({
        uid: 'firebase-user-123',
      } as Awaited<ReturnType<FirebaseAuthService['verifyIdToken']>>);

      const { context, request } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>({
          request: {
            headers: {
              authorization: 'Bearer valid-token',
            },
          },
        });

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(request.principal).toEqual({
        firebaseUid: 'firebase-user-123',
        email: null,
        emailVerified: false,
      });
    });

    it('propagates errors thrown by FirebaseAuthService', async () => {
      reflector.getAllAndOverride.mockReturnValue(false);

      firebaseAuthService.verifyIdToken.mockRejectedValue(
        new UnauthorizedException('Invalid Firebase ID token.'),
      );

      const { context } =
        createHttpExecutionContext<FirebaseAuthenticatedRequest>({
          request: {
            headers: {
              authorization: 'Bearer invalid-token',
            },
          },
        });

      await expect(guard.canActivate(context)).rejects.toThrow(
        new UnauthorizedException('Invalid Firebase ID token.'),
      );

      expect(firebaseAuthService.verifyIdToken).toHaveBeenCalledWith(
        'invalid-token',
      );
    });
  });
  
});
