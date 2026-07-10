import { SignupScreen } from "@/features/auth/components/EmailSignUpScreen";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function signin() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <SignupScreen />
    </SafeAreaView>
  );
}
