import type { PrismaClient } from '../../src/generated/prisma/client';

export async function resetTestDatabase(prisma: PrismaClient): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || !databaseUrl.includes('rookie_api_test') || !databaseUrl.includes('5434')) {
    throw new Error(`Refusing to reset database. Unexpected DATABASE_URL: ${databaseUrl}`);
  }

  const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations'
  `;

  if (tables.length === 0) {
    return;
  }

  const tableNames = tables.map(({ tablename }) => `"public"."${tablename}"`).join(', ');

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
}
