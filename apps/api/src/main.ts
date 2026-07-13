import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function getPort(): number {
  const runtime = globalThis as {
    process?: { env?: Record<string, string | undefined> };
  };
  const rawPort = runtime.process?.env?.PORT;

  if (!rawPort) {
    return 3000;
  }

  const parsedPort = Number.parseInt(rawPort, 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(getPort());
}
void bootstrap();
