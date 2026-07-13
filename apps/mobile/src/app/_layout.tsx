import "../global.css";

import { HeroUINativeProvider } from "heroui-native";
import { DarkTheme, DefaultTheme, Slot, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LogBox, Platform, useColorScheme, View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloatingDevTools } from "@buoy-gg/core";

import RootNavigator from "@/components/navigators/rootNavigator/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/lib/providers/authProvider/AuthProvider";

SplashScreen.preventAutoHideAsync().catch(() => {});

if (__DEV__ && Platform.OS === "ios") {
  LogBox.ignoreLogs(["hapticpatternlibrary.plist", "_UIKBFeedbackGenerator", "Error creating CHHapticPattern"]);
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <HeroUINativeProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <View className="flex-1 bg-background">
                  <RootNavigator />
                </View>
              </AuthProvider>
              <FloatingDevTools licenseKey={process.env.EXPO_PUBLIC_REACT_QUERY_DEVTOOLS_LICENSE_KEY!} />
            </QueryClientProvider>
          </ThemeProvider>
        </HeroUINativeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
