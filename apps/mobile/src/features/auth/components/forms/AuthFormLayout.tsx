import AppButton, { AppButtonLabel } from '@/components/ui/buttons/AppButton/AppButton';
import AppParagraph from '@/components/ui/text/Paragraph/AppParagraph';
import { Image } from 'expo-image';
import { Href, Link } from 'expo-router';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface AuthFormLayoutProps {
  children: React.ReactNode;
  isLoading?: boolean;
  submitButtonLabel?: string;
  onSubmit?: () => void;
  errorMessage?: string | null;
  linkText?: string;
  linkHref: Href;
}

export default function AuthFormLayout({
  children,
  isLoading = false,
  submitButtonLabel,
  errorMessage,
  linkHref,
  linkText,
  onSubmit,
}: AuthFormLayoutProps) {
  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 32,
        paddingTop: 32,
        gap: 16,
        justifyContent: 'space-evenly',
      }}
    >
      <View className="items-center pt-6">
        <Image
          source={require('../../../../../assets/images/Apple_Music_Classical_iOS_26_icon.png')}
          style={{ width: 220, height: 220 }}
          contentFit="contain"
        />
      </View>
      <View className="gap-4 w-full">
        {children}

        {submitButtonLabel && onSubmit && (
          <AppButton testID={'submit-button'} isLoading={isLoading} onPress={onSubmit}>
            <AppButtonLabel>{submitButtonLabel}</AppButtonLabel>
          </AppButton>
        )}

        {errorMessage ? <AppParagraph className="text-red-500">{errorMessage}</AppParagraph> : null}

        <View className="flex-row items-center justify-center gap-2">
          <Link replace href={linkHref}>
            <AppParagraph className="font-semibold text-primary">{linkText}</AppParagraph>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
