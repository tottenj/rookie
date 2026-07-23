import { UserRole } from "../../generated/prisma/enums";

export interface Actor {
  userId: string;
  firebaseUid: string;
  role: UserRole;
}
