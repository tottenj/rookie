import { Global, Module } from '@nestjs/common';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { AppUserGuard } from './guards/app-user.guard';
import { RolesGuard } from './guards/role.guard';
import { AuthContextService } from './services/auth-context.service';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [UserModule],
  providers: [FirebaseAuthGuard, AppUserGuard, RolesGuard, AuthContextService],
  exports: [FirebaseAuthGuard, AppUserGuard, RolesGuard, AuthContextService],
})
export class AuthModule {}
