import type { PrismaClient } from '../../src/generated/prisma/client';

export function seedTestDatabase(prisma: PrismaClient): Promise<void> {
  void prisma;

  return Promise.resolve();
}
