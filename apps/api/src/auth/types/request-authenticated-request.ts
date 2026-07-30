import type { AuthContext } from './auth-context';
import { FirebaseAuthenticatedRequest } from './firebase-authenticated-request';

export interface RequestWithOptionalAuthContext extends FirebaseAuthenticatedRequest {
  authContext?: AuthContext;
}
