import { Test, type TestingModule } from '@nestjs/testing';
import { AuthContextService } from '../../../src/auth/services/auth-context.service';
import { createFirebasePrincipalFactory } from '../../../test/factories/auth/firebasePrincipal.factory';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';
import { UserStatus } from '../../../src/generated/prisma/enums';
import { UserRepository } from '../../../src/user/repository/user.repository';
import { USER_REPOSITORY } from '../../../src/user/repository/user.repository.contract';
import { integrationPrisma } from '../../../test/integration/setup-integration';

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
        }
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
      const principal = createFirebasePrincipalFactory();

      const user = await prisma.user.create({
        data: {
          firebaseUid: principal.firebaseUid,
          email: principal.email!,
          status: UserStatus.ACTIVE,
        },
      });

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
  });
});
