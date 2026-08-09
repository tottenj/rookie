import { spawn, spawnSync } from 'node:child_process';

const isCi = process.argv.includes('--ci');
const isStudio = process.argv.includes('--studio');
const skipBuild = process.argv.includes('--skip-build');

const e2eEnv = {
  ...process.env,

  ROOKIE_E2E: 'true',
  MAESTRO_DRIVER_STARTUP_TIMEOUT: '180000',
  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
};

const mobileE2eEnv = {
  ...e2eEnv,

  APP_VARIANT: 'e2e',
  EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3000',
  EXPO_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
  EXPO_PUBLIC_FIREBASE_EMULATOR_HOST: '127.0.0.1',
  EXPO_PUBLIC_E2E: 'true',
};

const mobileStudioEnv = {
  ...e2eEnv,

  APP_VARIANT: 'development',

  EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3000',
  EXPO_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
  EXPO_PUBLIC_FIREBASE_EMULATOR_HOST: '127.0.0.1',
  EXPO_PUBLIC_E2E: 'true',
};

function run(command, args, env = e2eEnv) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function startApi() {
  const args = isCi
    ? ['--filter', '@rookie/api', 'run', 'start:e2e']
    : ['--filter', '@rookie/api', 'exec', 'dotenv', '-e', '.env.test', '--', 'pnpm', 'run', 'start:e2e'];

  return spawn('pnpm', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: e2eEnv,
  });
}

async function waitForApiHealth() {
  const url = 'http://127.0.0.1:3000/health';

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        console.log('✅ E2E API ready');
        return;
      }
    } catch {
      // API is still starting.
    }

    await sleep(500);
  }

  throw new Error(`E2E API did not become healthy at ${url}`);
}

function resetE2eEnvironment() {
  if (isCi) {
    run('pnpm', ['--filter', '@rookie/api', 'run', 'test:e2e:environment:setup']);

    return;
  }

  run('pnpm', [
    '--filter',
    '@rookie/api',
    'exec',
    'dotenv',
    '-e',
    '.env.test',
    '--',
    'pnpm',
    'run',
    'test:e2e:environment:setup',
  ]);
}

function startMetro(env = mobileE2eEnv) {
  return spawn('pnpm', ['--filter', '@rookie/mobile', 'run', 'dev'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });
}

async function waitForMetro() {
  const url = 'http://127.0.0.1:8081/status';

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        console.log('✅ Metro ready');
        return;
      }
    } catch {
      // Metro is still starting.
    }

    await sleep(500);
  }

  throw new Error(`Metro did not become healthy at ${url}`);
}

function buildAndInstallLocalE2eApp() {
  console.log('🛠 Generating E2E native project');

  run('pnpm', ['--filter', '@rookie/mobile', 'exec', 'expo', 'prebuild', '--clean', '--platform', 'ios'], mobileE2eEnv);

  console.log('🛠 Building and installing local E2E Release app');

  run(
    'pnpm',
    [
      '--filter',
      '@rookie/mobile',
      'exec',
      'expo',
      'run:ios',
      '--configuration',
      'Release',
      '--device',
      process.env.E2E_SIMULATOR_DEVICE ?? 'Rookie',
      '--no-bundler',
    ],
    mobileE2eEnv,
  );
}

function runMaestroSuite() {
  console.log('🚀 Running Maestro E2E suite');

  run('maestro', ['test', 'apps/mobile/src/__tests__/e2e/maestro/flows']);
}

async function runStudioMode() {
  const metroProcess = startMetro(mobileStudioEnv);

  try {
    await waitForMetro();

    console.log('');
    console.log('✅ Maestro Studio environment ready');
    console.log('');
    console.log('Use your existing Rookie development client.');
    console.log('Make sure Rookie is loaded in the simulator.');
    console.log('');
    console.log('Then, in another terminal:');
    console.log('');
    console.log('  maestro studio');
    console.log('');
    console.log('Press Ctrl+C here when finished.');
    console.log('');

    await waitUntilStopped();
  } finally {
    metroProcess.kill('SIGTERM');
  }
}

async function runSuiteMode() {
  if (!skipBuild) {
    buildAndInstallLocalE2eApp();
  } else {
    console.log('⏭ Skipping E2E app build');
  }
  runMaestroSuite();
}

function waitUntilStopped() {
  return new Promise((resolve) => {
    process.once('SIGINT', resolve);
    process.once('SIGTERM', resolve);
  });
}

function waitForProcessExit(childProcess) {
  return new Promise((_, reject) => {
    childProcess.once('exit', (code, signal) => {
      reject(new Error(`E2E API exited unexpectedly. code=${code} signal=${signal}`));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

resetE2eEnvironment();

const apiProcess = startApi();

try {
  await Promise.race([waitForApiHealth(), waitForProcessExit(apiProcess)]);

  console.log('✅ E2E backend environment ready');

  if (isStudio) {
    await runStudioMode();
  } else {
    await runSuiteMode();
  }
} finally {
  apiProcess.kill('SIGTERM');
}
