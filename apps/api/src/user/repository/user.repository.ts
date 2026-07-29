import { Injectable } from '@nestjs/common';
import { AuthUserRow, authUserSelect } from '../projections/auth-user.projection';
import type { UserRepositoryContract } from './user.repository.contract';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';


@Injectable()
export class UserRepository implements UserRepositoryContract {
  constructor(private readonly prisma: PrismaService) {}

  async findAuthUserByFirebaseUid(
    firebaseUid: string,
  ): Promise<AuthUserRow | null> {
    return this.prisma.user.findUnique({
      where: {
        firebaseUid,
      },
      select: authUserSelect,
    });
  }

  async createUserAccount(firebaseUid: string, email: string) {
    return this.prisma.user.create({
      data: {
        firebaseUid,
        email,
      },
    });
  }
}
