import { AuthContext } from '../../../src/auth/types/auth-context';

export function createUserFactory(
  overrides: Partial<AuthContext['user']> = {},
): AuthContext['user'] {
  return {
    id: 'test-user-id',
    firebaseUid: 'test-firebase-uid',
    email: 'test@example.com',
    role: 'USER',
    status: 'ACTIVE',
    profileId: 'test-profile-id',
    ...overrides,
  };
}
