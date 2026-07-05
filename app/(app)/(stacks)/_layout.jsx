// import React from 'react';
// import { Stack } from 'expo-router';

// export default function StacksLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: '#ffffff',
//         },
//         headerTintColor: '#1f2937',
//         headerTitleStyle: {
//           fontWeight: '600',
//         },
//         headerBackTitle: 'Back',
//       }}
//     >
//       <Stack.Screen name="transactions" options={{ title: 'Transactions' }} />
//       <Stack.Screen name="products" options={{ title: 'Products' }} />
//       <Stack.Screen name="inventory" options={{ title: 'Inventory Management' }} />
//       <Stack.Screen name="reports" options={{ title: 'Reports' }} />
//     </Stack>
//   );
// }























import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../../constants/theme';

export default function StacksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Stack.Screen name="products" options={{ title: 'Products' }} />
      <Stack.Screen name="inventory" options={{ title: 'Inventory Management' }} />
      <Stack.Screen name="reports" options={{ title: 'Reports' }} />
      <Stack.Screen name="stores" options={{ title: 'Stores' }} />
      <Stack.Screen name="users" options={{ title: 'Users' }} />
      <Stack.Screen name="payments" options={{ title: 'Payments' }} />
      <Stack.Screen name="receipts" options={{ title: 'Receipts' }} />
    </Stack>
  );
}