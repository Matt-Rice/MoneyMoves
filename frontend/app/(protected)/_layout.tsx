import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Once loading is done and there's no user, redirect to login
    if (!loading && !user) {
      // Use href to navigate to login
      router.push('../login');
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If not authenticated, return null to avoid flashing the screen
  if (!user) {
    return null;
  }

  // Authenticated: render protected children
  return <Slot />;
}
