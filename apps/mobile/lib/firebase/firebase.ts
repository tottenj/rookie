// apps/mobile/lib/firebase.ts
import { getApp } from "@react-native-firebase/app";
import { connectAuthEmulator, getAuth } from "@react-native-firebase/auth";
import { connectStorageEmulator, getStorage } from "@react-native-firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "@react-native-firebase/functions";

if(__DEV__){
    connectAuthEmulator(getAuth(), 'http://localhost:9099');
    connectStorageEmulator(getStorage(), 'http://localhost', 9199);
    connectFunctionsEmulator(getFunctions(), 'http://localhost', 5001);
}

export const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);
