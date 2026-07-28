import type { Prisma } from '../../generated/prisma/client';

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

export type AuthUserRow = Prisma.UserGetPayload<{
  select: typeof authUserSelect;
}>;
