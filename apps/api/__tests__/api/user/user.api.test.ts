import { getApp, getPrisma, mockFirebaseAuthService } from '../../../test/api/setup-api';
import request from 'supertest';

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
  });
});
