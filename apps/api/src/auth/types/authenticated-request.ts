import type { AuthContext } from './auth-context';
import { FirebaseAuthenticatedRequest } from './firebase-authenticated-request';

export interface AuthenticatedRequest extends FirebaseAuthenticatedRequest {
  authContext: AuthContext;
}
