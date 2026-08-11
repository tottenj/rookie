import { getApps, initializeApp, type App } from 'firebase-admin/app';
import { FIREBASE_ADMIN_APP } from './firebase.constants';
import { ConfigService } from '@nestjs/config';

export const firebaseAdminProvider = {
  provide: FIREBASE_ADMIN_APP,
  inject: [ConfigService],
  useFactory(configService: ConfigService): App {
    console.log({
      FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
    });
    const existingApp = getApps()[0];
    if (existingApp) return existingApp;
    const projectId = configService.getOrThrow<string>('FIREBASE_PROJECT_ID');
    return initializeApp({ projectId });
  },
};
