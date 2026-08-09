import { resetE2eFirebaseAuth } from './reset-e2e-firebase-auth';
import { seedE2eFirebase } from './seed-e2e-firebase';

async function main(): Promise<void> {
  await resetE2eFirebaseAuth();
  await seedE2eFirebase();

  console.log('Firebase E2E environment reset and seeded. 🌱');
}

void main();
