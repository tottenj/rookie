import AppTextField from "@/components/inputs/AppTextField/AppTextField";
import { Control, Controller, Path } from "react-hook-form";

interface HasPassword {
  password: string;
}

interface PasswordFieldProps<T extends HasPassword> {
  control: Control<T>;
  errorMessage?: string | undefined;
  name?: Path<T>;
}

export default function PasswordField<T extends HasPassword>({ control, name = "password" as Path<T>, errorMessage }: PasswordFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <AppTextField
          label="Password"
          error={errorMessage}
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
  );
}
