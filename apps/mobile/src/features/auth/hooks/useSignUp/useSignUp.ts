// apps/mobile/features/auth/hooks/useSignUp.ts
import { useMutation } from "@tanstack/react-query";
import { AuthRepository } from "../../../../../api/auth/auth.repository";
import { EmailSignUpSchema } from "@rookie/shared-types";
import { UsersRepository } from "@/lib/repositories/UserRepository";
import { mapAuthError } from "@/lib/errors/mapAuthErrors";

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: async (data: EmailSignUpSchema) => {
      const firebaseUser = await AuthRepository.signUp(data);
      try{
        const profile = await UsersRepository.create({ uid: firebaseUser.uid, email: firebaseUser.email });
        return { firebaseUser, profile };
      }catch (error) {
        await firebaseUser.delete().catch((deleteError) => {
          console.error("Failed to delete Firebase user:", deleteError);
        });
        throw error;
      }
    },
  });

  return {
    signUp: mutation.mutate,
    signUpAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    errorMessage: mapAuthError(mutation.error),
  };
}
