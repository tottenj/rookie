// apps/mobile/features/auth/hooks/useSignUp.ts
import { useMutation } from "@tanstack/react-query";
//import { router } from "expo-router";

//import { UserRepository } from "@/api/user.repository";
import { EmailSignUpSchema } from "@rookie/shared-types";
import { AuthRepository } from "../../../../api/auth/auth.repository";

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: EmailSignUpSchema) => {
      const firebaseUser = await AuthRepository.signUp(data);
      // optional: create the corresponding user record in your own DB via NestJS
      //await UserRepository.createProfile({ uid: firebaseUser.uid, email: firebaseUser.email });
      return firebaseUser;
    },
    onSuccess: () => {
      //router.replace("/(app)/home");
      // no need to manually setSession — onAuthStateChanged in AuthProvider fires automatically
    },
  });
}
