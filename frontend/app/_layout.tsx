import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider } from "../lib/auth";
import { createApiClient } from "../lib/api";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Initialize API client with router for redirects on auth errors
    createApiClient(router);
  }, [router]);

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  about: {},
  index: {},
});
