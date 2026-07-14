import EmailField from "@/components/inputs/emailField/EmailField";
import PasswordField from "@/components/inputs/passwordField/PasswordField";
import AppHeading from "@/components/ui/text/Heading/AppHeading";
import AuthFormLayout from "@/features/auth/components/forms/AuthFormLayout";
import { useSignIn } from "@/features/auth/hooks/useSignIn/useSignIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignInSchema, EmailSignInSchema } from "@rookie/shared-types";
import { useForm } from "react-hook-form";

export default function EmailSignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSignInSchema>({
    resolver: zodResolver(emailSignInSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn, isLoading, errorMessage } = useSignIn();
  const onSubmit = handleSubmit((data) => {
    signIn(data);
  });

  return (
    <AuthFormLayout linkText="Don\'t have an account? Create one" linkHref="/(auth)/signup" submitButtonLabel="Sign In" isLoading={isLoading} errorMessage={errorMessage} onSubmit={onSubmit}>
      <AppHeading type="h1">{"Sign In"}</AppHeading>
      <EmailField  control={control} errorMessage={errors.email?.message} />
      <PasswordField control={control} errorMessage={errors.password?.message} />
    </AuthFormLayout>
  );
}
