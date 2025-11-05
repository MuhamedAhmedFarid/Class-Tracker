import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(auth)/login"
        options={{ headerTitle: "Login", headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{ headerTitle: "Students", headerShown: false }}
      />
      <Stack.Screen
        name="(attendance)/[id]"
        options={{ headerTitle: "Attendance Details", headerShown: false }}
      />
    </Stack>
  );
}
