import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { DecodedIdToken } from 'firebase-admin/auth';

import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { FirebaseAuthService } from '../../src/infrastructure/firebase/firebase-auth.service';
import { resetTestDatabase } from '../integration/reset-test-database';
import { seedTestDatabase } from '../integration/seed-test-database';

const mockFirebaseAuthService: Pick<FirebaseAuthService, 'verifyIdToken'> = {
  verifyIdToken: async (token: string) =>
    ({
      uid: token,
      email: `${token}@test.local`,
      email_verified: true,
    }) as DecodedIdToken,
};

let app: INestApplication;
let prisma: PrismaService;

export function getApp(): INestApplication {
  return app;
}

export function getPrisma(): PrismaService {
  return prisma;
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(FirebaseAuthService)
    .useValue(mockFirebaseAuthService)
    .compile();

  app = moduleRef.createNestApplication();

  await app.init();

  prisma = app.get(PrismaService);
});

beforeEach(async () => {
  await resetTestDatabase(prisma);
  await seedTestDatabase(prisma);
});

afterAll(async () => {
  await app.close();
});
