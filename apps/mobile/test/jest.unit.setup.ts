import { notifyManager } from '@tanstack/react-query';

notifyManager.setScheduler((callback) => callback());

jest.mock('@react-native-firebase/functions', () => ({
  getFunctions: jest.fn(() => ({})),
  connectFunctionsEmulator: jest.fn(),
}));

jest.mock('@react-native-firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  connectStorageEmulator: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    signOut: jest.fn(),
  })),
  connectAuthEmulator: jest.fn(),

  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock('@react-native-firebase/app', () => ({
  getApp: jest.fn(() => ({})),
}));
