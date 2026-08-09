import { deleteApp, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

import { E2E_USERS } from '@rookie/test-fixtures';

import { assertFirebaseE2eEnvironment } from './assert-e2e-environment';

export async function seedE2eFirebase(): Promise<void> {
  assertFirebaseE2eEnvironment();

  const app = initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID!,
  });

  try {
    const auth = getAuth(app);

    await Promise.all(
      Object.values(E2E_USERS).map((user) =>
        auth.createUser({
          uid: user.firebaseUid,
          email: user.email,
          password: user.password,
          emailVerified: true,
        }),
      ),
    );

    console.log('Firebase E2E Seed Successful 🌱');
  } finally {
    await deleteApp(app);
  }
}
