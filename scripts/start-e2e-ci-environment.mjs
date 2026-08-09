import { spawn, spawnSync } from 'node:child_process';

const env = {
  ...process.env,

  CI: 'true',
  ROOKIE_E2E: 'true',
  E2E_DATABASE_ALLOW_RESET: 'true',

  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
};

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function startDetached(command, args) {
  const child = spawn(command, args, {
    env,
    detached: true,
    stdio: 'ignore',
    shell: process.platform === 'win32',
  });

  child.unref();

  return child;
}

async function waitForUrl(url, name) {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        console.log(`✅ ${name} ready`);
        return;
      }
    } catch {
      // Still starting.
    }

    await sleep(500);
  }

  throw new Error(`${name} did not become ready at ${url}`);
}

async function waitForFirebaseAuth() {
  /*
   * We only need to know that something is listening/responding.
   * A non-2xx response from this endpoint is still proof the emulator is up.
   */
  const url = `http://${env.FIREBASE_AUTH_EMULATOR_HOST}`;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      await fetch(url);
      console.log('✅ Firebase Auth emulator ready');
      return;
    } catch {
      // Still starting.
    }

    await sleep(500);
  }

  throw new Error('Firebase Auth emulator did not become ready.');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log('🔥 Starting Firebase emulators');

startDetached('pnpm', [
  'exec',
  'firebase',
  'emulators:start',
  '--only',
  'auth,storage',
  '--project',
  env.FIREBASE_PROJECT_ID,
]);

await waitForFirebaseAuth();

console.log('🗄️ Applying E2E migrations');

run('pnpm', ['--filter', '@rookie/api', 'exec', 'prisma', 'migrate', 'deploy']);

console.log('🌱 Resetting and seeding E2E environment');

run('pnpm', ['--filter', '@rookie/api', 'run', 'test:e2e:environment:setup']);

console.log('🚀 Starting Nest E2E API');

startDetached('pnpm', ['--filter', '@rookie/api', 'run', 'start:e2e']);

await waitForUrl('http://127.0.0.1:3000/health', 'Nest E2E API');

console.log('✅ Rookie E2E CI backend ready');
