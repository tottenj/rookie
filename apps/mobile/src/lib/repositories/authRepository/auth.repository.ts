// apps/mobile/api/auth.repository.ts
import { EmailSignInSchema, EmailSignUpSchema } from "@rookie/shared-types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { auth } from "../../../../lib/firebase/firebase";

export const AuthRepository = {
  signUp: async (data: { email: string; password: string }) => {
    const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    return credential.user;
  },

  signIn: async (data: EmailSignInSchema) => {
    const credential = await signInWithEmailAndPassword(auth, data.email, data.password);
    return credential.user;
  },

  signOut: async () => {
    await auth.signOut();
  },
};
