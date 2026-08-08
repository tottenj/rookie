// scripts/dev.mjs
import { spawn } from 'node:child_process';

function spawnPnpm(args) {
  return spawn('pnpm', args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

function waitForExit(child) {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve({
      code: child.exitCode,
      signal: child.signalCode,
    });
  }

  return new Promise((resolve, reject) => {
    child.once('error', reject);

    child.once('exit', (code, signal) => {
      resolve({ code, signal });
    });
  });
}

async function runPnpm(args) {
  const child = spawnPnpm(args);

  try {
    return await waitForExit(child);
  } catch (error) {
    console.error(`Failed to run: pnpm ${args.join(' ')}`);
    throw error;
  }
}

function isRunning(child) {
  return child && child.exitCode === null && child.signalCode === null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForExitWithTimeout(child, timeoutMs) {
  if (!isRunning(child)) {
    return { timedOut: false };
  }

  const exitResult = await Promise.race([
    waitForExit(child).then(() => ({ timedOut: false })),
    sleep(timeoutMs).then(() => ({ timedOut: true })),
  ]);

  return exitResult;
}

function runCommandCapture(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk);
    });

    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.once('error', reject);

    child.once('exit', (code) => {
      resolve({ code: code ?? 0, stdout, stderr });
    });
  });
}

async function getListeningPidsForPort(port) {
  const result = await runCommandCapture('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t']);

  if (result.code !== 0 && !result.stdout.trim()) {
    return [];
  }

  return result.stdout
    .split('\n')
    .map((value) => Number.parseInt(value.trim(), 10))
    .filter((pid) => Number.isInteger(pid) && pid > 0 && pid !== process.pid);
}

async function releasePort(port) {
  const pids = await getListeningPidsForPort(port);

  if (pids.length === 0) {
    return;
  }

  console.warn(`Releasing port ${port} by stopping PID(s): ${pids.join(', ')}`);

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Ignore stale PIDs and continue.
    }
  }

  // Give processes a brief chance to exit cleanly before forcing a kill.
  await new Promise((resolve) => setTimeout(resolve, 300));

  const remainingPids = await getListeningPidsForPort(port);
  for (const pid of remainingPids) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Ignore stale PIDs and continue.
    }
  }
}

function getNestPort() {
  const rawPort = process.env.PORT;

  if (!rawPort) {
    return 3000;
  }

  const parsedPort = Number.parseInt(rawPort, 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
}

async function releaseDevPorts() {
  const ports = [4000, 4400, 4500, 5001, 9099, 9199, getNestPort()];
  const uniquePorts = [...new Set(ports)];

  for (const port of uniquePorts) {
    await releasePort(port);
  }
}

async function main() {
  let firebaseChild = null;
  let appsChild = null;
  let shuttingDown = false;
  let shutdownSignal = null;
  let cleanupPromise = null;
  let shutdownPromise = null;

  async function stopChild(child, signal = 'SIGINT') {
    if (!isRunning(child)) {
      return;
    }

    child.kill(signal);

    const interruptResult = await waitForExitWithTimeout(child, 5000);
    if (!interruptResult.timedOut) {
      return;
    }

    child.kill('SIGTERM');

    const terminateResult = await waitForExitWithTimeout(child, 3000);
    if (!terminateResult.timedOut) {
      return;
    }

    child.kill('SIGKILL');
    await waitForExit(child);
  }

  async function cleanup() {
    if (cleanupPromise) {
      return cleanupPromise;
    }

    cleanupPromise = (async () => {
      const down = await runPnpm(['run', 'db:api:dev:down']);

      if (down.code !== 0 && !down.signal) {
        console.error(`Database shutdown failed with exit code ${down.code}.`);
        process.exitCode = down.code ?? 1;
      }

      /*
       * Stop the app watchers first. Firebase is stopped separately so it
       * receives exactly one intentional signal and can finish its export.
       */
      await stopChild(appsChild, 'SIGINT');
      await stopChild(firebaseChild, 'SIGINT');
    })();

    return cleanupPromise;
  }

  async function handleSignal(signal) {
    if (shutdownPromise) {
      return shutdownPromise;
    }

    shuttingDown = true;
    shutdownSignal = signal;

    shutdownPromise = (async () => {
      try {
        await cleanup();
        process.exitCode = 0;
      } catch (error) {
        console.error('Development environment cleanup failed:', error);
        process.exitCode = 1;
      }
    })();

    return shutdownPromise;
  }

  process.once('SIGINT', () => {
    void handleSignal('SIGINT').finally(() => {
      process.exit(process.exitCode ?? 0);
    });
  });

  process.once('SIGTERM', () => {
    void handleSignal('SIGTERM').finally(() => {
      process.exit(process.exitCode ?? 0);
    });
  });

  await releaseDevPorts();

  const up = await runPnpm(['run', 'db:api:dev:up']);

  if (up.code !== 0 || up.signal) {
    console.error('Database startup failed.');
    process.exitCode = up.code ?? 1;
    return;
  }

  firebaseChild = spawnPnpm(['run', 'emulators:persist']);
  appsChild = spawnPnpm(['run', 'dev:apps']);

  const firstExit = await Promise.race([
    waitForExit(firebaseChild).then((result) => ({
      process: 'firebase',
      ...result,
    })),
    waitForExit(appsChild).then((result) => ({
      process: 'apps',
      ...result,
    })),
  ]);

  if (!shuttingDown) {
    console.error(
      `${firstExit.process} exited unexpectedly` +
        (firstExit.signal ? ` from ${firstExit.signal}.` : ` with code ${firstExit.code ?? 0}.`),
    );

    shuttingDown = true;
    await cleanup();

    process.exitCode = firstExit.code && firstExit.code !== 0 ? firstExit.code : 1;
  }

  if (shutdownSignal) {
    await cleanup();
    process.exitCode = 0;
  }
}

void main().catch((error) => {
  console.error('Development environment failed:', error);
  process.exitCode = 1;
});
