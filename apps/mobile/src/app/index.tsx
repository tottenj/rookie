import { useAuth } from "@/lib/auth/AuthProvider";
import { View, Text } from "react-native";

export default function HomeScreen() {
  const auth = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Text className="text-red-300 text-4xl">Home Screen</Text>
    </View>
  );
}
