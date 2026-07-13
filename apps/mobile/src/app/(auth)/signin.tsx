import EmailSignInForm from "@/features/auth/components/forms/EmailSignInForm";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signin() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <EmailSignInForm />
    </SafeAreaView>
  );
}
