// apps/mobile/features/auth/hooks/useSignUp.ts
import { mapAuthError } from '@/lib/errors/mapAuthErrors/mapAuthErrors';
import { AuthRepository } from '@/lib/repositories/authRepository/auth.repository';
import { UsersRepository } from '@/lib/repositories/userRepository/UserRepository';
import { useMutation } from '@tanstack/react-query';
import { EmailSignUpSchema } from '@rookie/shared-types';

export function useSignUp() {
  const mutation = useMutation({
    mutationFn: async (data: EmailSignUpSchema) => {
      const firebaseUser = await AuthRepository.signUp({ email: data.email, password: data.password });
      console.log('Firebase user created:', firebaseUser.uid);
      try {
        if (!firebaseUser.email) throw new Error('Firebase user email is null');
        await UsersRepository.create();
      } catch (error) {
        console.log('Error creating user profile in backend:', error);
        await firebaseUser.delete().catch((deleteError) => {
          console.error('Failed to delete Firebase user:', deleteError);
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
