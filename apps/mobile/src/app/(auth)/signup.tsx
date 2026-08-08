import EmailSignUpForm from '@/features/auth/components/forms/emailSignUpForm/EmailSignUpForm';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signup() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmailSignUpForm />
    </SafeAreaView>
  );
}
