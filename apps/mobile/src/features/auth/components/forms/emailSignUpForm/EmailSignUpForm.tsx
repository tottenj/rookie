import EmailField from '@/components/inputs/emailField/EmailField';
import PasswordField from '@/components/inputs/passwordField/PasswordField';
import AppHeading from '@/components/ui/text/Heading/AppHeading';
import AuthFormLayout from '@/features/auth/components/forms/AuthFormLayout';
import { useSignUp } from '@/features/auth/hooks/useSignUp/useSignUp';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailSignUpSchema, EmailSignUpSchema } from '@rookie/shared-types';
import { useForm } from 'react-hook-form';

export default function EmailSignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSignUpSchema>({
    resolver: zodResolver(emailSignUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { signUp, isLoading, errorMessage } = useSignUp();
  const onSubmit = handleSubmit((data) => {
    console.log('Submitting sign-up form with data:', data);
    signUp(data);
  });

  return (
    <AuthFormLayout
      linkText="Already have an account? Sign in"
      linkHref="/(auth)/signin"
      submitButtonLabel="Sign Up"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onSubmit={onSubmit}
    >
      <AppHeading type="h1">{'Sign Up'}</AppHeading>
      <EmailField control={control} errorMessage={errors.email?.message} />
      <PasswordField control={control} errorMessage={errors.password?.message} />
      <PasswordField control={control} name="confirmPassword" errorMessage={errors.confirmPassword?.message} />
    </AuthFormLayout>
  );
}
