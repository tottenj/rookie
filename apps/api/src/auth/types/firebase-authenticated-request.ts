import type { Request } from 'express';
import type { FirebasePrincipal } from './firebase-principal';

export interface FirebaseAuthenticatedRequest extends Request {
  principal: FirebasePrincipal;
}
