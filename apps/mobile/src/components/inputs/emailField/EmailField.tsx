import AppTextField from "@/components/inputs/AppTextField/AppTextField";
import { Control, Controller, Path } from "react-hook-form";

interface HasEmail {
  email: string;
}

interface EmailFieldProps<T extends HasEmail> {
  control: Control<T>;
  errorMessage?: string | undefined;
  name?: Path<T>;
}

export default function EmailField<T extends HasEmail>({ control, name = "email" as Path<T>, errorMessage }: EmailFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <AppTextField
          label="Email"
          error={errorMessage}
          datacy={name ?? "email-field"}
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
  );
}
