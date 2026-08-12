import { getApp, getPrisma, mockFirebaseAuthService } from '../../../test/api/setup-api';
import request from 'supertest';
import { createAuthContextFixture } from '../../../test/integration/factories/createAuthContextFixture';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a user for the authenticated firebase principal', async () => {
      const app = getApp();
      const prisma = getPrisma();

      await request(app.getHttpServer()).post('/user').set('Authorization', 'Bearer new-user').expect(201);

      const createdUser = await prisma.user.findUnique({
        where: {
          firebaseUid: 'new-user',
        },
      });

      expect(mockFirebaseAuthService.verifyIdToken).toHaveBeenCalledWith('new-user');

      expect(createdUser).toBeDefined();
      expect(createdUser).toMatchObject({
        firebaseUid: 'new-user',
        email: 'new-user@test.local',
      });
    });

    it('should return 401 if the firebase principal is not authenticated', async () => {
      const app = getApp();
      await request(app.getHttpServer()).post('/user').expect(401);
    });

    it('should return 409 if a user already exists for the firebase principal', async () => {
      const app = getApp();
      const prisma = getPrisma();

      const { user } = await createAuthContextFixture(prisma);

      await request(app.getHttpServer()).post('/user').set('Authorization', `Bearer ${user.firebaseUid}`).expect(409);
    });

    it('should return 400 if the firebase principal does not have an email', async () => {
      const app = getApp();

      mockFirebaseAuthService.verifyIdToken.mockResolvedValueOnce({
        uid: 'no-email',
        email_verified: false,
      } as Awaited<ReturnType<typeof mockFirebaseAuthService.verifyIdToken>>);

      await request(app.getHttpServer()).post('/user').set('Authorization', 'Bearer no-email').expect(400);
    });
  });
});
