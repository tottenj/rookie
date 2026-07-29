import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '../../generated/prisma/enums';
import type { AuthContext } from '../types/auth-context';
import type { FirebasePrincipal } from '../types/firebase-principal';
import {
  USER_REPOSITORY,
  type UserRepositoryContract,
} from '../../user/repository/user.repository.contract';

@Injectable()
export class AuthContextService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryContract,
  ) {}

  async resolve(principal: FirebasePrincipal): Promise<AuthContext> {
    const user = await this.userRepository.findAuthUserByFirebaseUid(
      principal.firebaseUid,
    );

 
    if (!user) {
      throw new UnauthorizedException(
        'No Rookie account exists for this Firebase user.',
      );
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('This Rookie account is not active.');
    }

    return {
      principal,
      user: {
        id: user.id,
        role: user.role,
        status: user.status,
        firebaseUid: user.firebaseUid,
        email: user.email,
        profileId: user.profile?.id ?? null,
      },
    };
  }
}
