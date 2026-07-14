import type { User as FirebaseUser } from "@react-native-firebase/auth";
import type { AppUser as RookieUser } from "@rookie/shared-types";

export function createFirebaseUserFixture(overrides: Partial<FirebaseUser> = {}): FirebaseUser {
  return {
    uid: "firebase-user-123",
    email: "test@example.com",
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  } as unknown as FirebaseUser;
}

export function createRookieUserFixture(overrides: Partial<RookieUser> = {}): RookieUser {
  return {
    id: "database-user-123",
    uid: "firebase-user-123",
    email: "test@example.com",
    displayName: null,
    avatarUrl: null,
    createdAt: "2026-07-12T12:00:00.000Z",
    ...overrides,
  };
}
