import { AuthContext } from '../../../src/auth/types/auth-context';
import { createFirebasePrincipalFactory } from './firebasePrincipal.factory';
import { createUserFactory } from './user.factory';

type AuthContextOverrides = {
  principal?: Partial<AuthContext['principal']>;
  user?: Partial<AuthContext['user']>;
};

export function createAuthContextFactory(
  overrides: AuthContextOverrides = {},
): AuthContext {
  return {
    principal: createFirebasePrincipalFactory(overrides.principal),
    user: createUserFactory(overrides.user),
  };
}
