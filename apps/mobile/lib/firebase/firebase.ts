import { getApp } from '@react-native-firebase/app';
import { connectAuthEmulator, getAuth } from '@react-native-firebase/auth';
import { connectFunctionsEmulator, getFunctions } from '@react-native-firebase/functions';
import { connectStorageEmulator, getStorage } from '@react-native-firebase/storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);

type FirebaseGlobals = typeof globalThis & {
  __rookieFirebaseEmulatorsConnected?: boolean;
};

function getEmulatorHost(): string {
  const explicitHost = process.env.EXPO_PUBLIC_FIREBASE_EMULATOR_HOST;

  if (explicitHost) {
    return explicitHost;
  }

  if (Platform.OS === 'ios' && !Device.isDevice) {
    return '127.0.0.1';
  }

  const constants = Constants as unknown as {
    expoConfig?: { hostUri?: string };
    manifest?: { debuggerHost?: string };
    manifest2?: {
      extra?: {
        expoClient?: {
          hostUri?: string;
        };
      };
    };
  };

  const runtimeHostUri =
    constants.expoConfig?.hostUri ??
    constants.manifest2?.extra?.expoClient?.hostUri ??
    constants.manifest?.debuggerHost;

  if (runtimeHostUri) {
    const host = runtimeHostUri.split(':')[0];

    if (host) {
      return host;
    }
  }

  return Platform.OS === 'android' ? '10.0.2.2' : '127.0.0.1';
}

const useFirebaseEmulators = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === 'true';

if (useFirebaseEmulators) {
  const globals = globalThis as FirebaseGlobals;

  if (!globals.__rookieFirebaseEmulatorsConnected) {
    const host = getEmulatorHost();

    connectAuthEmulator(auth, `http://${host}:9099`);

    connectStorageEmulator(storage, host, 9199);

    connectFunctionsEmulator(functions, host, 5001);

    globals.__rookieFirebaseEmulatorsConnected = true;
  }
}
