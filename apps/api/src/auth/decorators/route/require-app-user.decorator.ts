// require-app-user.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '../../guards/firebase-auth.guard';
import { AppUserGuard } from '../../guards/app-auth.guard';

export function RequireAppUser() {
  return applyDecorators(UseGuards(FirebaseAuthGuard, AppUserGuard));
}
