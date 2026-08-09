export function assertE2eEnvironment(): void {
  if (process.env.ROOKIE_E2E !== 'true') {
    throw new Error('Refusing to run E2E setup because ROOKIE_E2E is not set to true.');
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.includes('rookie_api_test') || !databaseUrl.includes('5434')) {
    throw new Error(`Refusing to run E2E setup. Unexpected DATABASE_URL: ${databaseUrl}`);
  }
}

export function assertFirebaseE2eEnvironment(): void {
  assertE2eEnvironment();

  const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST;

  if (authEmulatorHost !== '127.0.0.1:9099' && authEmulatorHost !== 'localhost:9099') {
    throw new Error(`Refusing to seed Firebase. Unexpected FIREBASE_AUTH_EMULATOR_HOST: ${authEmulatorHost}`);
  }
}
