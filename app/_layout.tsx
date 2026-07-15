import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ExternalLinkProvider } from "@/lib/external-link";

// Portfolio demo build: reset per-visit state so each visitor starts fresh.
if (Platform.OS === "web") {
  AsyncStorage.removeItem("reminders").catch(() => {});

  // Pin the app's edges: no rubber-band blank above/below any scroll view on
  // iOS Safari. The journey map opts back in (data-allowoverscroll) so its
  // inner scroll can hand off to the page when it runs out.
  const style = document.createElement("style");
  style.textContent = `
    html, body { overscroll-behavior: none; }
    * { overscroll-behavior-y: none; }
    [data-allowoverscroll] { overscroll-behavior-y: auto; }
  `;
  document.head.appendChild(style);
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        // Roboto
        "Roboto-Thin": require("../assets/fonts/Roboto-Thin.ttf"),
        "Roboto-Light": require("../assets/fonts/Roboto-Light.ttf"),
        "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
        "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
        "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
        "Roboto-Black": require("../assets/fonts/Roboto-Black.ttf"),

        // Space Grotesk
        "SpaceGrotesk-Light": require("../assets/fonts/SpaceGrotesk-Light.ttf"),
        "SpaceGrotesk-Regular": require("../assets/fonts/SpaceGrotesk-Regular.ttf"),
        "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
        "SpaceGrotesk-SemiBold": require("../assets/fonts/SpaceGrotesk-SemiBold.ttf"),
        "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <ExternalLinkProvider>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name='login' options={{ headerShown: false }} />
                    <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                    <Stack.Screen name='+not-found' />
                </Stack>
            </ExternalLinkProvider>
        </ThemeProvider>
    );
}
