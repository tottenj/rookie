import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthContextService } from '../services/auth-context.service';
import { AuthenticatedRequest } from '../types/authenticated-request';

@Injectable()
export class AppUserGuard implements CanActivate {
  constructor(private readonly authContextService: AuthContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    request.authContext = await this.authContextService.resolve(request.principal);

    return true;
  }
}
