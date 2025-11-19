import { Stack } from "expo-router";
import "../global.css";
// Import necessary modules
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // Wrap the app with the QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerTitle: "Students", headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/login"
          options={{ headerTitle: "Login", headerShown: false }}
        />
        <Stack.Screen
          name="(auth)/signup"
          options={{ headerTitle: "Sign Up", headerShown: false }}
        />
       
        <Stack.Screen
          name="(attendance)/[id]"
          options={{ headerTitle: "Attendance Details", headerShown: false }}
        />
      </Stack>
    </QueryClientProvider>
  );
}