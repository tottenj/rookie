import { FirebasePrincipal } from '../../../src/auth/types/firebase-principal';
import { Prisma, User, UserStatus } from '../../../src/generated/prisma/client';
import { createFirebasePrincipalFactory } from '../../factories/auth/firebasePrincipal.factory';

type PrismaUserCreateClient = {
  user: {
    create: (args: { data: Prisma.UserCreateInput }) => Promise<User>;
  };
};

type CreateAuthContextFixtureOverrides = {
  principal?: Partial<FirebasePrincipal>;
  user?: Omit<Prisma.UserCreateInput, 'firebaseUid' | 'email'>;
};

export async function createAuthContextFixture(
  prisma: PrismaUserCreateClient,
  overrides: CreateAuthContextFixtureOverrides = {},
): Promise<{ principal: FirebasePrincipal; user: User }> {
  const principal = createFirebasePrincipalFactory(overrides.principal);

  if (!principal.email) {
    throw new Error('createAuthContextFixture requires a principal with an email');
  }

  const user = await prisma.user.create({
    data: {
      firebaseUid: principal.firebaseUid,
      email: principal.email,
      status: UserStatus.ACTIVE,
      ...overrides.user,
    },
  });

  return {
    principal,
    user,
  };
}
