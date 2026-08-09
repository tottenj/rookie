import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { resetTestDatabase } from '../database/reset-test-database';
import { assertE2eEnvironment } from './assert-e2e-environment';
import { seedE2eDatabase } from './seed-e2e-database';

async function main(): Promise<void> {
  assertE2eEnvironment();

  const configService = new ConfigService();
  const prisma = new PrismaService(configService);

  await prisma.$connect();

  try {
    await resetTestDatabase(prisma);
    await seedE2eDatabase(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
