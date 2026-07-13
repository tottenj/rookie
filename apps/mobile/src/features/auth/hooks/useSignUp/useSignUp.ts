// apps/mobile/features/auth/hooks/useSignUp.ts
import { useMutation } from "@tanstack/react-query";
import { EmailSignUpSchema } from "@rookie/shared-types";;
import { mapAuthError } from "@/lib/errors/mapAuthErrors";
import { AuthRepository } from "@/lib/repositories/authRepository/auth.repository";
import { UsersRepository } from "@/lib/repositories/userRepository/UserRepository";

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: async (data: EmailSignUpSchema) => {
      const firebaseUser = await AuthRepository.signUp({email: data.email, password: data.password});
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
