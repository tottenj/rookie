import { onRequest } from 'firebase-functions/v2/https';
import { seedE2eAuth } from './seed-e2e-auth';

export const seed = onRequest(async (req, res) => {
  if (!process.env.FUNCTIONS_EMULATOR) {
    res.status(403).send('This endpoint is only available in the Firebase emulator.');
    return;
  }
  if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error('Auth emulator is not running.');
  }

  await seedE2eAuth();

  res.send('Seed complete');
});
