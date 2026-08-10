import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../src/infrastructure/database/prisma/prisma.service';
import { UserService } from '../../../src/user/user.service';
import { USER_REPOSITORY } from '../../../src/user/repository/user.repository.contract';
import { UserRepository } from '../../../src/user/repository/user.repository';
import { integrationPrisma } from '../../../test/integration/setup-integration';
import { createFirebasePrincipalFactory } from '../../../test/factories/auth/firebasePrincipal.factory';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { createAuthContextFixture } from '../../../test/integration/factories/createAuthContextFixture';

describe('UserService integration', () => {
  let moduleRef: TestingModule;
  let userService: UserService;
  let prisma: PrismaService;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY, useClass: UserRepository },
        {
          provide: PrismaService,
          useValue: integrationPrisma,
        },
      ],
    }).compile();

    userService = moduleRef.get(UserService);
    prisma = moduleRef.get(PrismaService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('create', () => {
    it('creates a new user account', async () => {
      const principal = createFirebasePrincipalFactory();
      await userService.create(principal);
      expect(await prisma.user.findUnique({ where: { firebaseUid: principal.firebaseUid } })).not.toBeNull();
    });

    it('throws an error if no email is provided', async () => {
      const principal = createFirebasePrincipalFactory({ email: null });
      await expect(userService.create(principal)).rejects.toBeInstanceOf(BadRequestException);
      expect(await prisma.user.findUnique({ where: { firebaseUid: principal.firebaseUid } })).toBeNull();
    });

    it('throws an error if user already exists', async () => {
      const principal = createFirebasePrincipalFactory({ firebaseUid: 'existing-uid' });
      await createAuthContextFixture(prisma, {
        principal,
      });

      await expect(userService.create(principal)).rejects.toBeInstanceOf(ConflictException);
      expect(
        await prisma.user.count({
          where: { firebaseUid: principal.firebaseUid },
        }),
      ).toBe(1);
    });
  });
});
