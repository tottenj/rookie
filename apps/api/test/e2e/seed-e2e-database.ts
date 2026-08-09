import type { PrismaClient } from '../../src/generated/prisma/client';
import { E2E_USERS } from '@rookie/test-fixtures';

export async function seedE2eDatabase(prisma: PrismaClient): Promise<void> {
  const users = Object.values(E2E_USERS);

  await prisma.$transaction(
    users.map((user) =>
      prisma.user.create({
        data: {
          firebaseUid: user.firebaseUid,
          email: user.email,
          profile: {
            create: {
              displayName: user.displayName,
              username: user.username,
            },
          },
        },
      }),
    ),
  );

  console.log('E2E Database Seed Successful 🌱');
}
