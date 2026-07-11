// apps/mobile/features/auth/hooks/useSignUp.ts
import { useMutation } from "@tanstack/react-query";
//import { router } from "expo-router";

//import { UserRepository } from "@/api/user.repository";
import { EmailSignUpSchema } from "@rookie/shared-types";
import { AuthRepository } from "../../../../../api/auth/auth.repository";

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: AuthRepository.signUp,
  });

  return {
    signUp: mutation.mutate,
    signUpAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
