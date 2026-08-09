import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { resetTestDatabase } from '../database/reset-test-database';
import { seedIntegrationTestDatabase } from './seed-integration-test-database';

const configService = new ConfigService();

export const integrationPrisma = new PrismaService(configService);

beforeAll(async () => {
  await integrationPrisma.$connect();
});

beforeEach(async () => {
  await resetTestDatabase(integrationPrisma);
  await seedIntegrationTestDatabase(integrationPrisma);
});

afterAll(async () => {
  await integrationPrisma.$disconnect();
});
