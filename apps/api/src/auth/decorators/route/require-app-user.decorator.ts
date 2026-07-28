// require-app-user.decorator.ts
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AppUserGuard } from '../../guards/app-user.guard';

export function RequireAppUser() {
  return applyDecorators(UseGuards(AppUserGuard));
}
