import { UserRole, UserStatus } from '../../generated/prisma/enums';
import { FirebasePrincipal } from './firebase-principal';

export interface AuthContext {
  principal: FirebasePrincipal;

  user: {
    id: string;
    firebaseUid: string;
    email: string;
    profileId: string | null;
    role: UserRole;
    status: UserStatus;
  };
}
