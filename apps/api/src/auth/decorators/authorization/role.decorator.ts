import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from '../../../generated/prisma/enums';
import { AppUserGuard } from '../../guards/app-user.guard';
import { RolesGuard } from '../../guards/role.guard';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    UseGuards(AppUserGuard, RolesGuard),
  );
