// apps/mobile/features/auth/hooks/useSignUp.ts
import { useMutation } from "@tanstack/react-query";
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
