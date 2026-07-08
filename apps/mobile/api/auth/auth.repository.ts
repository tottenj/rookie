// apps/mobile/api/auth.repository.ts
import { EmailSignUpSchema } from "@rookie/shared-types";
import { auth } from "../../lib/firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@react-native-firebase/auth";

export const AuthRepository = {
  signUp: async (data: EmailSignUpSchema) => {
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    return credential.user;
  },

  signIn: async (data: EmailSignUpSchema) => {
    const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return credential.user;
  },

  signOut: async () => {
    await auth.signOut();
  },
};
