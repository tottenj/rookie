import { AuthUserRow } from '../projections/auth-user.projection';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryContract {
  findAuthUserByFirebaseUid(firebaseUid: string): Promise<AuthUserRow | null>;
}
