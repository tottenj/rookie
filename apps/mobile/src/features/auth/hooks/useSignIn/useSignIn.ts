import { useMutation } from "@tanstack/react-query";
import { AuthRepository } from "../../../../../api/auth/auth.repository";
import { mapAuthError } from "@/lib/errors/mapAuthErrors";

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
