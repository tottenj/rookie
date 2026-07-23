import { Request } from 'express';
import type { AuthContext } from './auth-context';

export interface AuthenticatedRequest extends Request {
  authContext: AuthContext;
}
