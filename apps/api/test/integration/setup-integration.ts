import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { resetTestDatabase } from './reset-test-database';
import { seedTestDatabase } from './seed-test-database';

const configService = new ConfigService();

export const integrationPrisma = new PrismaService(configService);

beforeAll(async () => {
  await integrationPrisma.$connect();
});

beforeEach(async () => {
  await resetTestDatabase(integrationPrisma);
  await seedTestDatabase(integrationPrisma);
});

afterAll(async () => {
  await integrationPrisma.$disconnect();
});
