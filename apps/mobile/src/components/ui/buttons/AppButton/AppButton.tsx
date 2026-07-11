import { Button, type ButtonRootProps, ButtonLabelProps, Spinner } from "heroui-native";
import { View } from "react-native";

type AppButtonProps = ButtonRootProps & {
  isLoading?: boolean;
};

export default function AppButton({ isLoading = false, children, ...buttonProps }: AppButtonProps) {
  return (
    <Button {...(buttonProps as ButtonRootProps)} >
      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center">
          <Spinner />
        </View>
      ) : null}

      <View style={{ opacity: isLoading ? 0 : 1 }}>{children}</View>
    </Button>
  );
}



type AppButtonLabelProps = ButtonLabelProps & {
  children: React.ReactNode;
};

export function AppButtonLabel({ children, ...labelProps }: AppButtonLabelProps) {
  return <Button.Label {...labelProps}>{children}</Button.Label>;
}