import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseAuthService } from '../../infrastructure/firebase/firebase-auth.service';
import { AuthContextService } from '../services/auth-context.service';
import { AuthenticatedRequest } from '../types/authenticated-requtest';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAuthService: FirebaseAuthService,
    private readonly authContextService: AuthContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);
    const decodedToken = await this.firebaseAuthService.verifyIdToken(token);
    request.authContext = await this.authContextService.resolve(decodedToken);
    return true;
  }

  private extractBearerToken(authorization: string | undefined): string {
    const [scheme, token] = authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('A Firebase ID token is required.');
    }
    return token;
  }
}
