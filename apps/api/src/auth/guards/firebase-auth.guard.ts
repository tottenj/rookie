import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseAuthService } from '../../infrastructure/firebase/firebase-auth.service';
import { FirebaseAuthenticatedRequest } from '../types/firebase-authenticated-request';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<FirebaseAuthenticatedRequest>();

    const token = this.extractBearerToken(request.headers.authorization);
    const decodedToken = await this.firebaseAuthService.verifyIdToken(token);

    request.principal = {
      firebaseUid: decodedToken.uid,
      email: decodedToken.email ?? null,
      emailVerified: decodedToken.email_verified ?? false,
    };

    return true;
  }

  private extractBearerToken(authorization?: string): string {
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('A Firebase ID token is required.');
    }

    return token;
  }
}
