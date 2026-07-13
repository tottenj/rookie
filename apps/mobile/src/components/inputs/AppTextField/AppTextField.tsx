import { FieldError, Input, Label, TextField } from "heroui-native";
import type { ComponentProps } from "react";

type AppTextFieldProps = ComponentProps<typeof TextField> & {
  label?: string;
  error?: string | undefined;
  inputProps?: ComponentProps<typeof Input>;
  datacy?: string
};

export default function AppTextField({ label, error, inputProps, datacy, ...props }: AppTextFieldProps) {
  return (
    <TextField {...props} isInvalid={!!error} data-cy={datacy}>
      {label && <Label>{label}</Label>}
      <Input {...inputProps} />
      {error && <FieldError>{error}</FieldError>}
    </TextField>
  );
}
