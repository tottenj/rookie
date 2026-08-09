import { assertFirebaseE2eEnvironment } from './assert-e2e-environment';

export async function resetE2eFirebaseAuth(): Promise<void> {
  const { FIREBASE_PROJECT_ID } = process.env;
  assertFirebaseE2eEnvironment();

  const host = process.env.FIREBASE_AUTH_EMULATOR_HOST;

  const response = await fetch(`http://${host}/emulator/v1/projects/${FIREBASE_PROJECT_ID}/accounts`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to reset Firebase Auth emulator: ${response.status} ${await response.text()}`);
  }
}
