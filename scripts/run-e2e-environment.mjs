import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { E2E_USERS } from '@rookie/test-fixtures';

const isCi = process.argv.includes('--ci');
const isStudio = process.argv.includes('--studio');
const skipBuild = process.argv.includes('--skip-build');

const E2E_IOS_APP_ID = 'com.jtotssteam.rookie.e2e';
const MOBILE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../apps/mobile');




const e2eEnv = {
  ...process.env,

  ROOKIE_E2E: 'true',
  MAESTRO_DRIVER_STARTUP_TIMEOUT: '180000',

  FIREBASE_AUTH_EMULATOR_HOST: '127.0.0.1:9099',
  FIREBASE_STORAGE_EMULATOR_HOST: '127.0.0.1:9199',
};

const mobileE2eEnv = {
  ...e2eEnv,

  // Release bundling should run in production mode even if CI uses NODE_ENV=test.
  NODE_ENV: 'production',
  BABEL_ENV: 'production',

  APP_VARIANT: 'e2e',
  EXPO_ROUTER_APP_ROOT: 'src/app',

  EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3000',
  EXPO_PUBLIC_USE_FIREBASE_EMULATORS: 'true',
  EXPO_PUBLIC_FIREBASE_EMULATOR_HOST: '127.0.0.1',
  EXPO_PUBLIC_E2E: 'true',
};


const { standard } = E2E_USERS;
const maestroEnv = {
  ...e2eEnv,

  MAESTRO_E2E_STANDARD_EMAIL: standard.email,
  MAESTRO_E2E_STANDARD_PASSWORD: standard.password,
  MAESTRO_E2E_STANDARD_USERNAME: standard.username,
  MAESTRO_E2E_STANDARD_DISPLAY_NAME: standard.displayName,
};

function run(command, args, env = e2eEnv) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
    cwd: process.cwd(),
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function runInDirectory(command, args, cwd, env = e2eEnv) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
    cwd,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed in ${cwd}: ${command} ${args.join(' ')}`);
  }
}

function verifyResolvedE2eBundleId() {
  const result = spawnSync('pnpm', ['exec', 'expo', 'config', '--type', 'public', '--json'], {
    stdio: 'pipe',
    shell: process.platform === 'win32',
    env: mobileE2eEnv,
    cwd: MOBILE_DIR,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.toString() ?? '';

    throw new Error(`Failed to resolve Expo config for E2E build. ${stderr}`);
  }

  const output = result.stdout?.toString() ?? '';

  let parsed;

  try {
    parsed = JSON.parse(output);
  } catch {
    throw new Error(`Unable to parse Expo config JSON from ${MOBILE_DIR}`);
  }

  const resolvedBundleId = parsed?.ios?.bundleIdentifier;

  if (resolvedBundleId !== E2E_IOS_APP_ID) {
    throw new Error(
      `Resolved wrong iOS bundle id for E2E build. expected=${E2E_IOS_APP_ID} actual=${resolvedBundleId ?? 'undefined'} cwd=${MOBILE_DIR}`,
    );
  }

  console.log(`✅ Resolved E2E iOS bundle id: ${resolvedBundleId}`);
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

function startE2eControlServer() {
  const args = isCi
    ? ['--filter', '@rookie/api', 'run', 'test:e2e:control']
    : ['--filter', '@rookie/api', 'exec', 'dotenv', '-e', '.env.test', '--', 'pnpm', 'run', 'test:e2e:control'];

  return spawn('pnpm', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: e2eEnv,
  });
}

async function waitForE2eControlHealth() {
  const url = 'http://127.0.0.1:3100/health';

  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        console.log('✅ E2E control server ready');
        return;
      }
    } catch {
      // Control server is still starting.
    }

    await sleep(500);
  }

  throw new Error(`E2E control server did not become healthy at ${url}`);
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

function buildAndInstallLocalE2eApp() {
  verifyResolvedE2eBundleId();

  console.log('🛠 Generating E2E native project');

  runInDirectory(
    'pnpm',
    [
      'exec',
      'cross-env',

      'APP_VARIANT=e2e',
      'NODE_ENV=production',
      'BABEL_ENV=production',

      'EXPO_ROUTER_APP_ROOT=src/app',

      'EXPO_PUBLIC_API_URL=http://127.0.0.1:3000',
      'EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true',
      'EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1',
      'EXPO_PUBLIC_E2E=true',

      'expo',
      'prebuild',
      '--clean',
      '--platform',
      'ios',
    ],
    MOBILE_DIR,
    e2eEnv,
  );

  console.log('🛠 Building and installing local E2E Release app');

  runInDirectory(
    'pnpm',
    [
      'exec',
      'cross-env',

      'APP_VARIANT=e2e',
      'NODE_ENV=production',
      'BABEL_ENV=production',

      'EXPO_ROUTER_APP_ROOT=src/app',

      'EXPO_PUBLIC_API_URL=http://127.0.0.1:3000',
      'EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true',
      'EXPO_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1',
      'EXPO_PUBLIC_E2E=true',

      'expo',
      'run:ios',
      '--configuration',
      'Release',
      '--device',
      process.env.E2E_SIMULATOR_DEVICE ?? 'Rookie',
      '--no-bundler',
    ],
    MOBILE_DIR,
    e2eEnv,
  );
}

function launchInstalledE2eIosApp() {
  const device = process.env.E2E_SIMULATOR_DEVICE ?? 'booted';

  run('xcrun', ['simctl', 'bootstatus', device, '-b']);

  const launchResult = spawnSync('xcrun', ['simctl', 'launch', device, E2E_IOS_APP_ID], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: e2eEnv,
  });

  if (launchResult.status === 0) {
    return;
  }

  console.error('❌ Failed to launch expected E2E app id:', E2E_IOS_APP_ID);

  console.error('🔎 Installed apps on simulator for debugging:');

  spawnSync('xcrun', ['simctl', 'listapps', device], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: e2eEnv,
  });

  throw new Error(`Expected iOS app id not launchable: ${E2E_IOS_APP_ID}`);
}

function prepareE2eApp() {
  if (!skipBuild) {
    buildAndInstallLocalE2eApp();
  } else {
    console.log('⏭ Skipping E2E app build');
  }

  launchInstalledE2eIosApp();
}

function runMaestroSuite() {
  console.log('🚀 Running Maestro E2E suite');
  run('maestro', ['test', 'apps/mobile/src/__tests__/e2e/maestro'], maestroEnv);
}

async function runStudioMode() {
  prepareE2eApp();

  console.log('');
  console.log('✅ Maestro Studio environment ready');
  console.log('');
  console.log(`Using E2E app: ${E2E_IOS_APP_ID}`);
  console.log('');
  console.log('In another terminal run:');
  console.log('');
  console.log('  maestro studio');
  console.log('');
  console.log('Press Ctrl+C here when finished.');
  console.log('');

  await waitUntilStopped();
}

function runSuiteMode() {
  prepareE2eApp();
  runMaestroSuite();
}

function waitUntilStopped() {
  return new Promise((resolve) => {
    process.once('SIGINT', resolve);
    process.once('SIGTERM', resolve);
  });
}

function waitForProcessExit(childProcess, name) {
  return new Promise((_, reject) => {
    childProcess.once('exit', (code, signal) => {
      reject(new Error(`${name} exited unexpectedly. code=${code} signal=${signal}`));
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

resetE2eEnvironment();

const apiProcess = startApi();
const controlProcess = startE2eControlServer();

try {
  await Promise.race([
    Promise.all([waitForApiHealth(), waitForE2eControlHealth()]),
    waitForProcessExit(apiProcess, 'E2E API'),
    waitForProcessExit(controlProcess, 'E2E control server'),
  ]);

  console.log('✅ E2E backend environment ready');

  if (isStudio) {
    await runStudioMode();
  } else {
    runSuiteMode();
  }
} finally {
  apiProcess.kill('SIGTERM');
  controlProcess.kill('SIGTERM');
}