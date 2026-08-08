import { spawnSync } from 'node:child_process';

const isCi = process.argv.includes('--ci');

function run(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv = process.env,
): void {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }
}

function runWithEnvironment(command: string, args: string[]): void {
  if (isCi) {
    run(command, args);
    return;
  }

  run('dotenv', ['-e', '.env.test', '--', command, ...args]);
}

try {
  run('pnpm', ['run', 'test:integration:setup']);

  runWithEnvironment('prisma', ['migrate', 'deploy']);

  runWithEnvironment('pnpm', ['run', 'test:api:run']);
} finally {
  run('pnpm', ['run', 'test:integration:teardown']);
}
