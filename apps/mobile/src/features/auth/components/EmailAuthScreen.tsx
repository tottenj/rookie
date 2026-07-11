import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignUpSchema, EmailSignUpSchema } from "@rookie/shared-types";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import AppTextField from "@/components/inputs/AppTextField/AppTextField";
import AppButton, { AppButtonLabel } from "@/components/ui/buttons/AppButton/AppButton";
import { useSignIn } from "@/features/auth/hooks/useSignIn/useSignIn";
import { useSignUp } from "@/features/auth/hooks/useSignUp/useSignUp";
import AppHeading from "@/components/ui/text/Heading/AppHeading";
import AppParagraph from "@/components/ui/text/Paragraph/AppParagraph";

export function EmailAuthScreen({ signup = false }: { signup?: boolean }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSignUpSchema>({
    resolver: zodResolver(emailSignUpSchema),
    mode: "onBlur",
  });

  const { signUp, isLoading: isSignUpLoading, error: signUpError } = useSignUp();
  const { signIn, isLoading: isSignInLoading, error: signInError } = useSignIn();

  const isLoading = signup ? isSignUpLoading : isSignInLoading;
  const authError = signup ? signUpError : signInError;

  function onSubmit(data: EmailSignUpSchema) {
    if (signup) {
      console.log("signing up with data:", data);
      signUp(data);
      return;
    }

    signIn(data);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 px-4 pb-8 pt-8 gap-16 justify-evenly">
      <View className="items-center pt-6">
        <Image source={require("../../../../assets/images/Apple_Music_Classical_iOS_26_icon.png")} style={{ width: 220, height: 220 }} contentFit="contain" />
      </View>

      <View className="gap-4 w-full">
        <AppHeading type="h1">{signup ? "Sign Up" : "Sign In"}</AppHeading>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextField
              label="Email"
              error={errors.email?.message}
              inputProps={{
                value,
                onChangeText: onChange,
                onBlur,
                placeholder: "Enter your email",
                keyboardType: "email-address",
                autoCapitalize: "none",
                autoComplete: "email",
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextField
              label="Password"
              error={errors.password?.message}
              inputProps={{
                value,
                onChangeText: onChange,
                onBlur,
                placeholder: "Password",
                secureTextEntry: true,
                autoComplete: "password",
              }}
            />
          )}
        />

        {signup && (
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextField
                label="Confirm Password"
                error={errors.confirmPassword?.message}
                inputProps={{
                  value,
                  onChangeText: onChange,
                  onBlur,
                  placeholder: "Confirm Password",
                  secureTextEntry: true,
                  autoComplete: "password",
                }}
              />
            )}
          />
        )}

        <AppButton isLoading={isLoading} onPress={handleSubmit(onSubmit)}>
          <AppButtonLabel>{signup ? "Sign Up" : "Sign In"}</AppButtonLabel>
        </AppButton>

        {authError instanceof Error ? <AppParagraph className="text-red-500">{authError.message}</AppParagraph> : null}

        <View className="flex-row items-center justify-center gap-2">
          <Link replace href={signup ? "/(auth)/signin" : "/(auth)/signup"} className="font-semibold text-primary">
            <AppParagraph>{signup ? "Already have an account?" : "Don\'t have an account?"}</AppParagraph>
            {signup ? " Sign In" : " Create Account"}
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
