// import React, { useEffect } from 'react';
// import { Stack, router } from 'expo-router';
// import { useAuth } from '../../hooks/useAuth';
// import { useRole } from '../../hooks/useRole';
// import { ActivityIndicator, View, Text } from 'react-native';
// import { Colors } from '../../constants/theme';

// export default function AdminLayout() {
//   const { user, isLoading } = useAuth();
//   const { isSuperAdmin, isAdmin } = useRole();

//   // Protect admin routes
//   useEffect(() => {
//     if (!isLoading) {
//       if (!user || (!isSuperAdmin && !isAdmin)) {
//         router.replace('/(app)/(tabs)');
//       }
//     }
//   }, [user, isLoading, isSuperAdmin, isAdmin]);

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   if (!user || (!isSuperAdmin && !isAdmin)) {
//     return null;
//   }

//   return (
//     <Stack
//       screenOptions={{
//         headerStyle: {
//           backgroundColor: Colors.white,
//         },
//         headerTintColor: Colors.gray800,
//         headerTitleStyle: {
//           fontWeight: '600',
//         },
//         headerBackTitle: 'Back',
//       }}
//     >
//       <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
//       <Stack.Screen name="staff" options={{ title: 'Staff Management' }} />
//       <Stack.Screen name="stores" options={{ title: 'Store Management' }} />
//       <Stack.Screen name="audit-logs" options={{ title: 'Audit Logs' }} />
//       <Stack.Screen name="settings" options={{ title: 'System Settings' }} />
//     </Stack>
//   );
// }
























import React, { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useRole } from '../../hooks/useRole';
import { ActivityIndicator, View, Text } from 'react-native';
import { Colors } from '../../constants/theme';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const { isSuperAdmin, isAdmin } = useRole();

  useEffect(() => {
    if (!isLoading) {
      if (!user || (!isSuperAdmin && !isAdmin)) {
        router.replace('/(app)/(tabs)');
      }
    }
  }, [user, isLoading, isSuperAdmin, isAdmin]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user || (!isSuperAdmin && !isAdmin)) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.gray800,
        headerTitleStyle: { fontWeight: '600' },
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
      <Stack.Screen name="staff" options={{ title: 'Staff Management' }} />
      <Stack.Screen name="stores" options={{ title: 'Store Management' }} />
      <Stack.Screen name="audit-logs" options={{ title: 'Audit Logs' }} />
      <Stack.Screen name="settings" options={{ title: 'System Settings' }} />
    </Stack>
  );
}