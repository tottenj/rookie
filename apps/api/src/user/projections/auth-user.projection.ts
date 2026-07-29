import { Prisma } from '../../generated/prisma/client';
import type { UserGetPayload } from '../../generated/prisma/models/User';

export const authUserSelect = {
  id: true,
  firebaseUid: true,
  email: true,
  role: true,
  status: true,
  profile: {
    select: {
      id: true,
    },
  },
} as const satisfies Prisma.UserSelect;

export type AuthUserRow = UserGetPayload<{
  select: typeof authUserSelect;
}>;
