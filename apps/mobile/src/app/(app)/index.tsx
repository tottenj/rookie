import { useAuth } from '@/lib/providers/authProvider/AuthProvider';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const { user } = useAuth();
  return (
    <SafeAreaView>
      <Text>{user ? `Hello, ${user.uid}` : 'Not logged in'}</Text>
    </SafeAreaView>
  );
}
