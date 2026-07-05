import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/theme';

export default function Index() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      const timer = setTimeout(() => {
        if (user) {
          // Navigate based on role
          if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
            router.replace('/(app)/(tabs)');
          } else {
            router.replace('/(app)/(tabs)');
          }
        } else {
          router.replace('/(auth)/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, isMounted, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}