import { createServer } from 'node:http';

import { resetAndSeedE2eEnvironment } from './reset-and-seed-e2e-environment';

const HOST = '127.0.0.1';
const PORT = 3100;

const server = createServer(async (request, response) => {
  if (request.method === 'POST' && request.url === '/reset') {
    try {
      console.log('🧹 Resetting E2E environment');

      await resetAndSeedE2eEnvironment();

      response.writeHead(204);
      response.end();
    } catch (error) {
      console.error('❌ E2E environment reset failed', error);

      response.writeHead(500, {
        'Content-Type': 'application/json',
      });

      response.end(
        JSON.stringify({
          error: 'Failed to reset E2E environment.',
        }),
      );
    }

    return;
  }

  if (request.method === 'GET' && request.url === '/health') {
    response.writeHead(200, {
      'Content-Type': 'application/json',
    });

    response.end(
      JSON.stringify({
        status: 'ok',
      }),
    );

    return;
  }

  response.writeHead(404);
  response.end();
});

server.listen(PORT, HOST, () => {
  console.log(`✅ E2E control server ready at http://${HOST}:${PORT}`);
});
