import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { USER_REPOSITORY, type UserRepositoryContract } from '../../user/repository/user.repository.contract';
import { UserStatus } from '../../generated/prisma/enums';
import { AuthContextService } from './auth-context.service';
import { createFirebasePrincipalFactory } from '../../../test/factories/auth/firebasePrincipal.factory';
import { createAuthUserRowFactory } from '../../../test/factories/auth/authUserRow.factory';

describe('AuthContextService', () => {
  let authContextService: AuthContextService;
  let userRepository: jest.Mocked<Pick<UserRepositoryContract, 'findAuthUserByFirebaseUid'>>;

  beforeEach(async () => {
    userRepository = {
      findAuthUserByFirebaseUid: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthContextService,
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    authContextService = moduleRef.get(AuthContextService);
  });

  describe('resolve', () => {
    it.each([[null], ['test-profile-id']])(
      'successfully resolves the auth context when the user is found and active and profileId is %p',
      async (profileIdValue) => {
        const principal = createFirebasePrincipalFactory();
        const mockUser = createAuthUserRowFactory({
          profile: profileIdValue === null ? null : { id: profileIdValue },
        });

        userRepository.findAuthUserByFirebaseUid.mockResolvedValue(mockUser);
        const result = await authContextService.resolve(principal);

        expect(result).toEqual({
          principal,
          user: {
            id: mockUser.id,
            role: mockUser.role,
            status: mockUser.status,
            firebaseUid: mockUser.firebaseUid,
            email: mockUser.email,
            profileId: mockUser.profile?.id ?? null,
          },
        });

        expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(principal.firebaseUid);

        expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);
      },
    );

    it('throws UnauthorizedException when the user is not found', async () => {
      userRepository.findAuthUserByFirebaseUid.mockResolvedValue(null);
      const principal = createFirebasePrincipalFactory();
      const result = authContextService.resolve(principal);

      await expect(result).rejects.toEqual(
        new UnauthorizedException('No Rookie account exists for this Firebase user.'),
      );

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(principal.firebaseUid);

      expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);
    });

    it.each([[UserStatus.SUSPENDED], [UserStatus.DELETED]])(
      "throws UnauthorizedException when the user's status is %s",
      async (status) => {
        const principal = createFirebasePrincipalFactory();
        userRepository.findAuthUserByFirebaseUid.mockResolvedValue({
          id: 'user-id',
          role: 'USER',
          status: status,
          firebaseUid: principal.firebaseUid,
          email: principal.email ?? 'user@example.com',
          profile: null,
        });

        const result = authContextService.resolve(principal);

        await expect(result).rejects.toEqual(new UnauthorizedException('This Rookie account is not active.'));

        expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledWith(principal.firebaseUid);

        expect(userRepository.findAuthUserByFirebaseUid).toHaveBeenCalledTimes(1);
      },
    );
  });
});
