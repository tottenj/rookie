import { AuthUserRow } from '../../../src/user/projections/auth-user.projection';
import { UserRole, UserStatus } from '../../../src/generated/prisma/enums';

type AuthUserRowOverrides = Omit<Partial<AuthUserRow>, 'profile'> & {
  profile?: Partial<NonNullable<AuthUserRow['profile']>> | null;
};

export function createAuthUserRowFactory(overrides: AuthUserRowOverrides = {}): AuthUserRow {
  const defaultProfile: NonNullable<AuthUserRow['profile']> = {
    id: 'test-profile-id',
  };

  return {
    id: 'test-user-id',
    firebaseUid: 'test-firebase-uid',
    email: 'test@example.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    ...overrides,
    profile:
      overrides.profile === null
        ? null
        : {
            ...defaultProfile,
            ...overrides.profile,
          },
  };
}
