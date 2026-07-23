import { getApps, type App } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP } from './firebase.constants';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase-admin';

export const firebaseAdminProvider = {
  provide: FIREBASE_ADMIN_APP,

  inject: [ConfigService],

  useFactory(configService: ConfigService): App {
    const existingApp = getApps()[0];
    if (existingApp) return existingApp;
    const projectId = configService.getOrThrow<string>('FIREBASE_PROJECT_ID');
    return initializeApp({ projectId });
  },
};
