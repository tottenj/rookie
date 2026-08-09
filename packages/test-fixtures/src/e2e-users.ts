export const E2E_USERS = {
  standard: {
    firebaseUid: 'e2e-standard-user',
    email: 'e2e-standard@rookie.test',
    password: 'TestPassword123!',
    displayName: 'E2E Standard User',
    username: 'e2e_standard',
  },
} as const;

export type E2eUser = (typeof E2E_USERS)[keyof typeof E2E_USERS];