import { isE2E } from '@/lib/test/constants/isE2e';
import { FieldError, Input, Label, TextField } from 'heroui-native';
import type { ComponentProps } from 'react';

type AppTextFieldProps = ComponentProps<typeof TextField> & {
  label?: string;
  error?: string | undefined;
  inputProps?: ComponentProps<typeof Input>;
};

export default function AppTextField({ label, error, inputProps, testID, ...props }: AppTextFieldProps) {
  const isSecureField = inputProps?.secureTextEntry === true;

  const resolvedInputProps: ComponentProps<typeof Input> = {
    ...inputProps,
    ...(isE2E
      ? {
          autoComplete: isSecureField ? 'one-time-code' : 'off',
          textContentType: isSecureField ? 'oneTimeCode' : 'none',
          passwordRules: isSecureField ? undefined : '',
        }
      : {}),
  };

  return (
    <>
      <TextField {...props} isInvalid={!!error} testID={testID}>
        {label && <Label>{label}</Label>}
        <Input {...resolvedInputProps} />
        {error && <FieldError>{error}</FieldError>}
      </TextField>
    </>
  );
}
