import { Alert, Platform } from "react-native";

type AlertButton = { text: string; onPress?: () => void; style?: "default" | "cancel" | "destructive" };

/* Alert.alert is a silent no-op on react-native-web, so error paths would
   just freeze in the browser. On the web fall back to window.alert and run
   the primary button's action; native keeps the real Alert. */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]): void {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    const primary = buttons?.find((b) => b.style !== "cancel") ?? buttons?.[0];
    primary?.onPress?.();
    return;
  }
  Alert.alert(title, message, buttons);
}
