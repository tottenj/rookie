import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignUpSchema, EmailSignUpSchema } from "@rookie/shared-types";
import { View, TextInput, Text, Button } from "react-native";

export function SignupScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSignUpSchema>({
    resolver: zodResolver(emailSignUpSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: EmailSignUpSchema) => {
    await Promise.resolve(data);
  };

  return (
    <View>
      <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />} />
      {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}

      <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <TextInput value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Password" secureTextEntry />} />
      {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
