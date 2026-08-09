import type { PrismaClient } from '../../src/generated/prisma/client';

export function seedIntegrationTestDatabase(prisma: PrismaClient): Promise<void> {
  void prisma;

  return Promise.resolve();
}
