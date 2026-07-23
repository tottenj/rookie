import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { AuthContext } from '../types/auth-context';
import { UserRepository } from '../../user/user.repository';

@Injectable()
export class AuthContextService {
  constructor(private readonly userRepository: UserRepository) {}

  async resolve(decodedToken: DecodedIdToken): Promise<AuthContext> {
    const user = await this.userRepository.findAuthUserByFirebaseUid(
      decodedToken.uid,
    );

    if (!user) {
      throw new UnauthorizedException(
        'No Rookie account exists for this Firebase user.',
      );
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('This Rookie account is not active.');
    }

    return {
      principal: {
        firebaseUid: decodedToken.uid,
        email: decodedToken.email ?? null,
        emailVerified: decodedToken.email_verified ?? false,
      },
      user: {
        id: user.id,
        role: user.role,
        status: user.status,
        firebaseUid: user.firebaseUid,
        email: user.email,
        profileId: user.profileId,
      },
    };
  }
}
