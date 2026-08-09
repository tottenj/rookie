import { auth } from '../infrastructure';

const E2E_USER = {
  uid: 'e2e-standard-user',
  email: 'e2e-standard@rookie.test',
  password: 'TestPassword123!',
} as const;

export async function seedE2eAuth(): Promise<void> {
  try {
    await auth.deleteUser(E2E_USER.uid);
  } catch {
    // User may not exist yet.
  }

  await auth.createUser({
    uid: E2E_USER.uid,
    email: E2E_USER.email,
    password: E2E_USER.password,
    emailVerified: true,
  });
}
