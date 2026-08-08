import { UserRole, UserStatus } from '../../generated/prisma/enums';
import { FirebasePrincipal } from './firebase-principal';

export interface AuthUser {
  id: string;
  firebaseUid: string;
  email: string;
  profileId: string | null;
  role: UserRole;
  status: UserStatus;
}

export interface AuthContext {
  principal: FirebasePrincipal;
  user: AuthUser;
}