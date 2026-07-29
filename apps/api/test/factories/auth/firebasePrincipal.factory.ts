import { FirebasePrincipal } from '../../../src/auth/types/firebase-principal';

export function createFirebasePrincipalFactory(
  overrides: Partial<FirebasePrincipal> = {},
): FirebasePrincipal {
  return {
    firebaseUid: 'firebase-user-1',
    email: 'user@example.com',
    emailVerified: true,
    ...overrides,
  };
}
