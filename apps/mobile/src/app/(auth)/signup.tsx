import { EmailAuthScreen } from "@/features/auth/components/EmailAuthScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmailAuthScreen signup={true} />
    </SafeAreaView>
  );
}
