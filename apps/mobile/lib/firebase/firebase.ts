// apps/mobile/lib/firebase.ts
import { getApp } from "@react-native-firebase/app";
import { connectAuthEmulator, getAuth } from "@react-native-firebase/auth";
import { connectStorageEmulator, getStorage } from "@react-native-firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "@react-native-firebase/functions";

export const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);

if (__DEV__) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectStorageEmulator(storage, "http://localhost", 9199);
  connectFunctionsEmulator(functions, "http://localhost", 5001);
}