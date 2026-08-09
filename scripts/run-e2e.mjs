import { spawnSync } from 'node:child_process';

const isCi = process.argv.includes('--ci');
const isStudio = process.argv.includes('--studio');

const e2eEnv = {
  ...process.env,
  ROOKIE_E2E: 'true',
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

function runApiWithEnvironment(command, args) {
  if (isCi) {
    run('pnpm', ['--filter', '@rookie/api', 'exec', command, ...args]);
    return;
  }

  run('pnpm', ['--filter', '@rookie/api', 'exec', 'dotenv', '-e', '.env.test', '--', command, ...args]);
}

try {
  run('pnpm', ['--filter', '@rookie/api', 'run', 'db:test:up']);

  runApiWithEnvironment('prisma', ['migrate', 'deploy']);

  console.log('✅ E2E database ready');

  const childArgs = [];

  if (isStudio) {
    childArgs.push('--studio');
  }

  if (isCi) {
    childArgs.push('--ci');
  }

  run('pnpm', [
    'exec',
    'firebase',
    'emulators:exec',
    `node ./scripts/run-e2e-environment.mjs ${childArgs.join(' ')}`,
    '--only',
    'auth,storage',
  ]);
} finally {
  run('pnpm', ['--filter', '@rookie/api', 'run', 'db:test:down']);
}
