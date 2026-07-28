import { applyDecorators, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';

export function RequireFirebaseUser() {
  return applyDecorators(UseGuards(FirebaseAuthGuard));
}
