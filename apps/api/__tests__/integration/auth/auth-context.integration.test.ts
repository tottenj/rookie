import { Test, type TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthContextService } from '../../../src/auth/services/auth-context.service';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';
import { UserRepository } from '../../../src/user/repository/user.repository';
import { USER_REPOSITORY } from '../../../src/user/repository/user.repository.contract';
import { integrationPrisma } from '../../../test/integration/setup-integration';
import { createAuthContextFixture } from '../../../test/integration/factories/createAuthContextFixture';
import { createFirebasePrincipalFactory } from '../../../test/factories/auth/firebasePrincipal.factory';
import { UserStatus } from '../../../src/generated/prisma/enums';

describe('AuthContextService integration', () => {
  let moduleRef: TestingModule;
  let authContextService: AuthContextService;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthContextService,
        {
          provide: USER_REPOSITORY,
          useClass: UserRepository,
        },
        {
          provide: PrismaService,
          useValue: integrationPrisma,
        },
      ],
    }).compile();

    authContextService = moduleRef.get(AuthContextService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('resolve', () => {
    it('resolves the user from the database', async () => {
      const { principal, user } = await createAuthContextFixture(prisma);
      const result = await authContextService.resolve(principal);

      expect(result).toEqual({
        principal,
        user: {
          id: user.id,
          role: user.role,
          status: user.status,
          firebaseUid: user.firebaseUid,
          email: user.email,
          profileId: null,
        },
      });
    });

    it('throws UnauthorizedException if no user found', async () => {
      const principal = createFirebasePrincipalFactory({
        firebaseUid: 'nonexistent-uid',
      });

      await expect(authContextService.resolve(principal)).rejects.toBeInstanceOf(UnauthorizedException);
    });


    it.each([
      Object.entries(UserStatus).map(([_, value]) => value).filter((status) => status !== UserStatus.ACTIVE),
    ])("throws if the user's status is not ACTIVE", async (status) => {
      const { principal} = await createAuthContextFixture(prisma, {
        user:{
          status: status
        }
      });

      await expect(authContextService.resolve(principal)).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
