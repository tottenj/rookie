/* eslint-disable @typescript-eslint/unbound-method */
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './role.guard';
import { Test } from '@nestjs/testing';
import { createHttpExecutionContext } from '../../../test/factories/nest/executionContext.factory';
import type { RequestWithOptionalAuthContext } from '../types/request-authenticated-request';
import { UserRole } from '../../generated/prisma/enums';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  beforeEach(async () => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: reflector,
        },
      ],
    }).compile();

    guard = moduleRef.get(RolesGuard);
  });

  describe('canActivate', () => {
    it.each([[], undefined, null])('should allow access if no roles required', (value) => {
      const { context } = createHttpExecutionContext<RequestWithOptionalAuthContext>();
      reflector.getAllAndOverride.mockReturnValue(value);
      expect(guard.canActivate(context)).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.any(String), [
        context.getHandler(),
        context.getClass(),
      ]);

      const getRequestMock = context.switchToHttp().getRequest as jest.Mock;
      expect(getRequestMock).not.toHaveBeenCalled();
    });

    it('should throw if role and user is not present', () => {
      const { context } = createHttpExecutionContext<RequestWithOptionalAuthContext>();
      reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context)).toThrow('An application user is required for this route.');

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.any(String), [
        context.getHandler(),
        context.getClass(),
      ]);

      const getRequestMock = context.switchToHttp().getRequest as jest.Mock;
      expect(getRequestMock).toHaveBeenCalled();
    });

    it('should throw if users do not have the required role', () => {
      const { context } = createHttpExecutionContext<RequestWithOptionalAuthContext>({
        request: {
          authContext: {
            principal: {
              firebaseUid: 'firebase-uid',
              email: '',
              emailVerified: false,
            },
            user: {
              id: 'user-id',
              role: UserRole.USER,
              firebaseUid: 'firebase-uid',
              email: '',
              status: 'ACTIVE',
              profileId: null,
            },
          },
        },
      });
      reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
      expect(() => guard.canActivate(context)).toThrow('You do not have permission to access this route.');

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.any(String), [
        context.getHandler(),
        context.getClass(),
      ]);

      const getRequestMock = context.switchToHttp().getRequest as jest.Mock;
      expect(getRequestMock).toHaveBeenCalled();
    });

    it('should allow access if user has the required role', () => {
      const { context } = createHttpExecutionContext<RequestWithOptionalAuthContext>({
        request: {
          authContext: {
            principal: {
              firebaseUid: 'firebase-uid',
              email: '',
              emailVerified: false,
            },
            user: {
              id: 'user-id',
              role: UserRole.ADMIN,
              firebaseUid: 'firebase-uid',
              email: '',
              status: 'ACTIVE',
              profileId: null,
            },
          },
        },
      });
      reflector.getAllAndOverride.mockReturnValue([UserRole.ADMIN]);
      expect(guard.canActivate(context)).toBe(true);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.any(String), [
        context.getHandler(),
        context.getClass(),
      ]);

      const getRequestMock = context.switchToHttp().getRequest as jest.Mock;
      expect(getRequestMock).toHaveBeenCalled();
    });

    it('should allow access if user has one of the required roles', () => {
      const { context } = createHttpExecutionContext<RequestWithOptionalAuthContext>({
        request: {
          authContext: {
            principal: {
              firebaseUid: 'firebase-uid',
              email: '',
              emailVerified: false,
            },
            user: {
              id: 'user-id',
              role: UserRole.ADMIN,
              firebaseUid: 'firebase-uid',
              email: '',
              status: 'ACTIVE',
              profileId: null,
            },
          },
        },
      });
      reflector.getAllAndOverride.mockReturnValue([UserRole.USER, UserRole.ADMIN]);
      expect(guard.canActivate(context)).toBe(true);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(expect.any(String), [
        context.getHandler(),
        context.getClass(),
      ]);

      const getRequestMock = context.switchToHttp().getRequest as jest.Mock;
      expect(getRequestMock).toHaveBeenCalled();
    });
  });
});
