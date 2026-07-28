import { Global, Module } from '@nestjs/common';
import { firebaseAdminProvider } from './firebase-admin.provider';
import { FirebaseAuthService } from './firebase-auth.service';

@Global()
@Module({
  providers: [firebaseAdminProvider, FirebaseAuthService],
  exports: [firebaseAdminProvider, FirebaseAuthService],
})
export class FirebaseModule {}
