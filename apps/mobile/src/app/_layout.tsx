import "../global.css";

import { HeroUINativeProvider } from "heroui-native";
import { DarkTheme, DefaultTheme, Slot, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloatingDevTools } from "@buoy-gg/core";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import RootNavigator from "@/components/navigators/rootNavigator/RootNavigator";

SplashScreen.preventAutoHideAsync().catch(() => {});
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
            <FloatingDevTools licenseKey={process.env.EXPO_PUBLIC_REACT_QUERY_DEVTOOLS_LICENSE_KEY!} />
          </QueryClientProvider>
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
