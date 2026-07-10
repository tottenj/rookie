import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSignUpSchema, EmailSignUpSchema } from "@rookie/shared-types";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";

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
    <View style={styles.container}>
      <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Email" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" />} />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Password" placeholderTextColor="#888" secureTextEntry />} />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  button: {
    backgroundColor: "#208AEF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
