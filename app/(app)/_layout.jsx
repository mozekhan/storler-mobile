import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';

export default function AppLayout() {
  const { user, isLoading, currentStore } = useAuth();
  const { isSuperAdmin, isAdmin } = useRole();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(modals)" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="(stacks)" options={{ headerShown: false }} />
    </Stack>
  );
}