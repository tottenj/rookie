import { Inject, Injectable } from '@nestjs/common';
import { FIREBASE_ADMIN_APP } from './firebase.constants';
import { type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthService {
  constructor(
    @Inject(FIREBASE_ADMIN_APP)
    private readonly firebaseApp: App,
  ) {}

  verifyIdToken(idToken: string) {
    return getAuth(this.firebaseApp).verifyIdToken(idToken);
  }
}
