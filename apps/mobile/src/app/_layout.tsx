import "../global.css";

import { HeroUINativeProvider } from "heroui-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FloatingDevTools } from "@buoy-gg/core";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <QueryClientProvider client={queryClient}>
            <AnimatedSplashOverlay />
            <AppTabs />
            <FloatingDevTools licenseKey={process.env.EXPO_PUBLIC_REACT_QUERY_DEVTOOLS_LICENSE_KEY!} />
          </QueryClientProvider>
        </ThemeProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
