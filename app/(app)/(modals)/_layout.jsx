
import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'modal',
        headerShown: false,
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.gray800,
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen name="transaction-detail" options={{ title: 'Transaction Details' }} />
      <Stack.Screen name="product-search" options={{ title: 'Search Products' }} />
      <Stack.Screen name="receipt-preview" options={{ title: 'Receipt Preview' }} />
      <Stack.Screen name="payment-modal" options={{ title: 'Payment' }} />
      <Stack.Screen name="inventory-adjust" options={{ title: 'Adjust Stock' }} />
    </Stack>
  );
}