import { Stack } from "expo-router";
import "../global.css";
// 1. Import necessary modules for React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. Create a QueryClient instance outside of the component
// This client will hold the cache and configuration
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 3. Wrap the entire application (the Stack Navigator) with the provider
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
        <Stack.Screen
          name="(settings)"
          options={{ headerTitle: "Attendance Details", headerShown: false }}
        />
      </Stack>
    </QueryClientProvider>
  );
}