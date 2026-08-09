import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { resetTestDatabase } from '../database/reset-test-database';
import { assertFirebaseE2eEnvironment } from './assert-e2e-environment';
import { resetE2eFirebaseAuth } from './reset-e2e-firebase-auth';
import { seedE2eDatabase } from './seed-e2e-database';
import { seedE2eFirebase } from './seed-e2e-firebase';

async function main(): Promise<void> {
  assertFirebaseE2eEnvironment();

  const configService = new ConfigService();
  const prisma = new PrismaService(configService);

  await prisma.$connect();

  try {
    await resetTestDatabase(prisma);
    await seedE2eDatabase(prisma);

    await resetE2eFirebaseAuth();
    await seedE2eFirebase();

    console.log('E2E environment reset and seeded. 🌱');
  } finally {
    await prisma.$disconnect();
  }
}

void main();
