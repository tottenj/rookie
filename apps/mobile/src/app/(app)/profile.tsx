import AppButton, { AppButtonLabel } from '@/components/ui/buttons/AppButton/AppButton';
import { AuthRepository } from '@/lib/repositories/authRepository/auth.repository';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView>
      <Text>Profile</Text>
      <AppButton onPress={async () => {await AuthRepository.signOut()}}>
        <AppButtonLabel>Logout</AppButtonLabel>
      </AppButton>
    </SafeAreaView>
  );
}
