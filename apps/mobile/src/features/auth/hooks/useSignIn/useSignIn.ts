import { useMutation } from "@tanstack/react-query";

import { mapAuthError } from "@/lib/errors/mapAuthErrors/mapAuthErrors";
import { AuthRepository } from "@/lib/repositories/authRepository/auth.repository";

export function useSignIn() {
  const mutation = useMutation({
    mutationFn: AuthRepository.signIn,
  });

  return {
    signIn: mutation.mutate,
    signInAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    errorMessage: mapAuthError(mutation.error),
  };
}
