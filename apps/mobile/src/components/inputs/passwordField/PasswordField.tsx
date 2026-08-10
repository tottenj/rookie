import AppTextField from '@/components/inputs/AppTextField/AppTextField';
import { Control, Controller, Path } from 'react-hook-form';



const isE2E = process.env.EXPO_PUBLIC_E2E === 'true';


interface HasPassword {
  password: string;
}

interface PasswordFieldProps<T extends HasPassword> {
  control: Control<T>;
  errorMessage?: string | undefined;
  name?: Path<T>;
}

export default function PasswordField<T extends HasPassword>({
  control,
  name = 'password' as Path<T>,
  errorMessage,
}: PasswordFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value } }) => (
        <AppTextField
          label="Password"

          testID={`${name ?? 'password'}-field`}
          error={errorMessage}
          inputProps={{
            textContentType: isE2E ? 'none' : 'emailAddress',
            testID: `${name ?? 'password'}-input`,
            value,
            onChangeText: onChange,
            onBlur,
            placeholder: 'Password',
            secureTextEntry: true,
            autoComplete: isE2E ? 'off' : 'password',
          }}
        />
      )}
    />
  );
}
