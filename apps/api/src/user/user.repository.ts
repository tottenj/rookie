// users/users.repository.ts

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../infrastructure/database/prisma/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAuthUserByFirebaseUid(firebaseUid: string) {
    return this.prisma.user.findUnique({
      where: {
        firebaseUid,
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        role: true,
        status: true,
        profileId: true,
      },
    });
  }
}
